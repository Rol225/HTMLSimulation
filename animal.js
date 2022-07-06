class Animal extends Entity{
    xWay = 1;
    yWay = 1;
    randomProbabilityMove = randomInteger(0, 200);
    constructor(x, y, size, color, energy, sensitivity = 15, speed, swarm) {
        super(x, y, size, uNumberString(), color, energy);
        this.energy = energy;
        this.sensitivity = sensitivity;
        this.speed = speed;
        this.swarm = swarm;
        this.lifeStatus = 'alive';
    }

    /**
     * Удаление
     * сущности
     * */
    remove(ctx){
        this.eraseEntity(ctx);
        this.setEntitySquare(-100000, -100000, 0);
        this.lifeStatus = 'died';
    }

    /**
     * Минимальное кол-во
     * энергии для
     * передвижения
     * */
    energyCosts(){
        return Math.floor(Math.pow(this.size * SIZE, 2) * Math.pow(this.speed * SPEED, 2));
    }

    /**
     * Мозг животного
     * */
    brain(ctx, mapSizeX, mapSizeY, data){
        const energyCosts = this.energyCosts();

        let newAnimals = [];

        for(let i = 0; i < this.speed; i++){
            if(this.energy >= energyCosts && this.energy < ENERGY_COST * energyCosts){
                // ищем растения
                let isTarget = this.searchEatingPlants(ctx, data.plants);
                if(!isTarget && this.energy < (ENERGY_COST * energyCosts / 5)){
                    // Ищем животных, но не своей стаи
                    isTarget = this.searchEatingAnimals(ctx, this.swarm, data.animals);
                    // Если не нашли и энергии очень мало, то ищем любых животных
                    if(!isTarget && this.energy <= (ENERGY_COST * energyCosts / 10)){
                        isTarget = this.searchEatingAnimals(ctx, data.animals);
                    }
                }
                // Если нет целей совсем, то просто двигаемся
                if(!isTarget)
                    this.simpleMove(mapSizeX, mapSizeY);

            } else if(this.energy >= ENERGY_COST * energyCosts){
                let isTarget = false;
                // Размножение партеногенезом
                if(!isTarget){
                    let newArr = this.parthenogenesis();
                    newAnimals = newAnimals.concat(newArr);
                }

            } else{
                this.remove(ctx);
            }

        }

        return newAnimals;
    }

    /**
     * Функция размножения
     * партеногенезом
     * */
    parthenogenesis(){
        const energyCosts = this.energyCosts();
        let newAnimals = [];
        let speed = this.speed, sensitivity = this.sensitivity, size = this.size, color = this.color;
        let randomNumber = randomInteger(0, 90);

        if(randomNumber <= 30){
            speed += randomInteger(-1, 1);
            if(speed <= 0)
                speed = this.speed;
        }else if(randomNumber <= 60){
            size += randomNum(-1, 1);
            if(size <= 0)
                size = this.size;
        }else if(randomNumber <= 90){
            sensitivity += randomNum(-1, 1);
            if(sensitivity <= 0)
                sensitivity = this.sensitivity;
        }

        this.energy -= Math.floor((this.energy / 2));

        let newAnimal = new Animal(this.x, this.y, size, color, this.energy, sensitivity, speed, this.swarm);
        let val = randomInteger(0, 2);
        if(val === 0){
            newAnimal.xWay = this.xWay * (-1);
            newAnimal.yWay = this.yWay * (-1);
        }else if(val === 1){
            newAnimal.xWay = this.xWay * (1);
            newAnimal.yWay = this.yWay * (-1);
        }else if(val === 2){
            newAnimal.xWay = this.xWay * (-1);
            newAnimal.yWay = this.yWay * (1);
        }
        newAnimals.push(newAnimal);

        return newAnimals;
    }

    /**
     * Поиск и поедание
     * растений
     * */
    searchEatingPlants(ctx, plants){
        // Радиус обнаружения цели
        let entityRadius = new Entity(this.x, this.y, this.size, 'radius','rgba(0,0,0,0.5)', 0, this.sensitivity);
        let ifTarget = false; // Метка обнаружения цели
        let food;

        let movX = this.x;
        let movY = this.y;
        let wayEnd = 99999999;
        for(let i = 0; i < plants.length; i++){
            let target = plants[i];     // Цель
            if(target.lifeStatus === 'died')
                continue;
            // Если цель находится в радиусе обнаружения
            if(target && (entityRadius.Conflict(target) || target.Conflict(entityRadius))){
                ifTarget = true;
                let a = this.targetSearch(target, wayEnd);
                if(a.way.wayEnd !== wayEnd){
                    movX = a.way.movX;
                    movY = a.way.movY;
                    wayEnd = a.way.wayEnd;
                    food = a.food;
                }
            }
        }

        if(ifTarget){
            // двигаемся к цели
            this.mov(movX, movY);
            // Если можем съесть, то едим
            if(food && (this.Conflict(food) || food.Conflict(this))) {
                this.energy += food.energy - 1;
                food.remove(ctx);
            }
        }

        return ifTarget;
    }

    /**
     * Поиск и поедание
     * животных
     * */
    searchEatingAnimals(ctx, theseAnimal='', animals){
        // Радиус обнаружения цели
        let entityRadius = new Entity(this.x, this.y, this.size, 'radius','rgba(0,0,0,0.5)', 0, this.sensitivity);
        let ifTarget = false; // Метка обнаружения цели
        let food;

        let movX = this.x;
        let movY = this.y;
        let wayEnd = 99999999;

        // Перебираем животных
        for(let swarm in animals){
            if(swarm.toString() === theseAnimal)
                continue;
            // Перебираем животных и ищем до кого ближе
            for(let i = 0; i < animals[swarm].length; i++){
                let target = animals[swarm][i];     // Цель
                if(target.lifeStatus === 'died' || target.id === this.id)
                    continue;
                // Если цель находится в радиусе обнаружения
                if(target && target.size < this.size && (entityRadius.Conflict(target) || target.Conflict(entityRadius))){
                    ifTarget = true;
                    let a = this.targetSearch(target, wayEnd);
                    if(a.way.wayEnd !== wayEnd){
                        movX = a.way.movX;
                        movY = a.way.movY;
                        wayEnd = a.way.wayEnd;
                        food = a.food;
                    }
                }
            }
        }

        if(ifTarget){
            // двигаемся к цели
            this.mov(movX, movY);
            // Если можем съесть, то едим
            if(food && (this.Conflict(food) || food.Conflict(this))) {
                if(theseAnimal === this.swarm){
                    this.swarm = uNumberString();
                    this.color = "#" + ((1<<24)*Math.random() | 0).toString(16);
                }
                this.energy += food.energy - 5;
                food.remove(ctx);
            }
        }

        return ifTarget;
    }

    /**
     * Поиск ближайшей
     * сущности
     * */
    targetSearch(target, wayEnd){

        let movX, movY;
        let food;

        let smallMovY = this.y;
        let smallMovX = this.x;
        let way, xWay = 0, yWay = 0;

        // Если цель выше или ниже
        if(target.y < this.y){
            smallMovY =  this.y - 1;
            yWay = this.y - target.y;
        } else if(target.y > this.y){
            smallMovY =  this.y + 1;
            yWay = target.y - this.y;
        }

        // Если цель левее или правее
        if(target.x < this.x){
            smallMovX = this.x - 1;
            xWay = this.x - target.x
        } else if (target.x > this.x){
            smallMovX = this.x + 1;
            xWay = target.x - this.x;
        }

        // Поиск кротчайшего пути
        way = xWay + yWay;
        if(way < wayEnd){
            movX = smallMovX;
            movY = smallMovY;
            wayEnd = way;
            food = target;
        }

        return {
            way: {
                movX: movX,
                movY: movY,
                wayEnd: wayEnd
            },
            food: food
        }
    }

    /**
     * Перемещение
     * животного
     * */
    mov(x, y){
        const energyCosts = this.energyCosts();
        this.setEntitySquare(x, y);
        this.energy -= energyCosts;
    }

    /**
     * Простое перемещение
     * животного
     * */
    simpleMove(mapSizeX, mapSizeY){
        let energyCosts = this.energyCosts();
        if(this.energy >= energyCosts){
            let movX;
            let movY;

            // Решение сменить направление
            if(randomInteger(0, 200) === this.randomProbabilityMove){
                this.randomProbabilityMove = randomInteger(0, 200);
                let randomProbabilityMove = randomInteger(0, 8);
                if(randomProbabilityMove === 0){
                    this.xWay = 0;
                    this.yWay = 0;
                    energyCosts = 0;
                }else if(randomProbabilityMove === 1){
                    this.xWay = 0;
                    this.yWay = 1;
                }else if(randomProbabilityMove === 2){
                    this.xWay = 1;
                    this.yWay = 0;
                }else if(randomProbabilityMove === 3){
                    this.xWay = 1;
                    this.yWay = 1;
                }else if(randomProbabilityMove === 4){
                    this.xWay = 0;
                    this.yWay = -1;
                }else if(randomProbabilityMove === 5){
                    this.xWay = -1;
                    this.yWay = 0;
                }else if(randomProbabilityMove === 6){
                    this.xWay = -1;
                    this.yWay = -1;
                }else if(randomProbabilityMove === 7){
                    this.xWay = 1;
                    this.yWay = -1;
                }else if(randomProbabilityMove === 8){
                    this.xWay = -1;
                    this.yWay = 1;
                }
            }

            if(this.x + this.size + 1 >= mapSizeX) this.xWay = -1;
            else if(this.x - 1 <= 0) this.xWay = 1;

            if(this.y + this.size  + 1 >= mapSizeY) this.yWay = -1;
            else if(this.y - 1 <= 0) this.yWay = 1;

            if(this.xWay === 1) movX = this.x + 1;
            else movX = this.x - 1;

            if(this.yWay === 1) movY = this.y + 1;
            else movY = this.y - 1;

            this.setEntitySquare(movX, movY);

            this.energy -= energyCosts;
        }
    }
}


