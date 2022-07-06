class Data {
    constructor(animals = [], plants = [], days = 0) {
        this.animals = animals;
        this.plants = plants;
        this.days = days;
    }

    /**
     * Получить скорость
     * существ
     * */
    getAnimalsSpeed(){
        let speed = 0;
        let count = 0;
        for (let swarm in this.animals){
            this.animals[swarm].forEach(function (anim) {
                if(anim.lifeStatus !== 'died'){
                    speed += anim.speed - 1;
                    count++;
                }
            });
        }


        return speed;
    }

    /**
     * Получить размер
     * существ
     * */
    getAnimalsSize(){
        let size = 0;
        let count = 0;
        for (let swarm in this.animals){
            this.animals[swarm].forEach(function (anim) {
                if(anim.lifeStatus !== 'died'){
                    size += anim.size - 5;
                    count++;
                }
            });
        }

        return size;
    }

    /**
     * Получить радиус обнаружения
     * еды существ
     * */
    getAnimalsSensitivity(){
        let sensitivity = 0;
        let count = 0;
        for (let swarm in this.animals){
            this.animals[swarm].forEach(function (anim) {
                if(anim.lifeStatus !== 'died'){
                    sensitivity += anim.sensitivity - 10;
                    count++;
                }
            });
        }

        return sensitivity;
    }


    /**
     * Получить кол-во
     * существ
     * */
    getAnimalsPopulations(){
        let populations = 0;
        for (let swarm in this.animals){
            this.animals[swarm].forEach(function (anim) {
                if(anim.lifeStatus !== 'died'){
                    populations++;
                }
            });
        }

        return populations;
    }
}
