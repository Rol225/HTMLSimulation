/**
 * Симуляция
 * */
class Simulator {
    newSpeed = 0;
    canvas;
    ctx;
    pause = true;
    SysPause = false;
    countDie = 0;
    countAlive = 0;

    constructor(id, sizeX, sizeY, speedSimulator, AnimalsArray = [], plants = [], SimulatorIterations) {
        this.data = new Data(AnimalsArray, plants, 0);
        this.simulatorDays = 0;
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = sizeX;
        this.canvas.height = sizeY;
        this.speedSimulator = speedSimulator;
        this.dayDuration = 1000 / this.speedSimulator;
        this.nowTime = 0;
        this.chart_1 = new Chart(SimulatorIterations, 'charts', 'chart_container');
        this.Init(plants.length, speedSimulator);

        /**
         * Главный цикл
         * */
        this.main = (event) =>  {
            if(!this.SysPause){
                this.update();
                this.drawAnimal();
                this.nowTime++;
                document.querySelector('#Time').innerHTML = this.nowTime.toString();
                if(this.nowTime >= this.dayDuration) this.newDay();
                requestAnimationFrame(this.main);
            }
        }
    }

    /**
     * Создание окна
     * настроек
     * */
    toolbarCreate(){
        let _this = this;
        const toolbar = document.createElement('div');
        toolbar.classList.add('toolbar');
        const firstRow = document.createElement('div');
        firstRow.classList.add('toolbar-row');

        const toolbarItem_speed = document.createElement('div');
        toolbarItem_speed.classList.add('toolbar-item');
        toolbarItem_speed.innerHTML =
            `<label for="speedSimulator">Скорость</label>
             <input type="range" id="speedSimulator" min=1 max="10" step="1" value="`+this.speedSimulator+`">
             <span>x<span id="speedVal">`+this.speedSimulator+`</span></span>`;
        toolbarItem_speed.addEventListener('input',  function (event) {
            _this.newSpeed = Number(event.target.value);
            _this.pause = false;
            this.parentNode.querySelector('#speedVal').innerHTML = _this.newSpeed.toString();
        });
        const toolbarItem_time = document.createElement('div');
        toolbarItem_time.classList.add('toolbar-item');
        toolbarItem_time.innerHTML=`
            <span style="width:283px;">Time: <span id="TimeEnd">`+parseInt(this.dayDuration)+`</span>/<span id="Time">0</span></span>
        `;
        firstRow.appendChild(toolbarItem_speed);
        firstRow.appendChild(toolbarItem_time);
        toolbar.appendChild(firstRow);
        this.canvas.parentNode.appendChild(toolbar);
    }

    /**
     * Инициализация
     * плагина
     * */
    Init(){
        let _this = this;
        this.canvas.addEventListener('click', event => {
            if(_this.pause){
                _this.pause = false;
                _this.SysPause = false;
                _this.main();
                console.log('start')
            }else{
                _this.pause = true;
                console.log('stop')
            }
        });

        this.toolbarCreate();
        this.drawAnimal();
        this.chart_1.setData(new Data(this.data.animals, this.simulatorDays, this.Plants));
    }

    /**
     * Итоги дня
     * */
    newDay(){
        let _this = this;
        this.simulatorDays++;

        if(this.data.plants.length > 15 && this.simulatorDays % 3 === 0){
            this.data.plants.splice(0,1);
            this.data.plants[0].remove(this.ctx ,'white');
        }

        document.querySelector('#food').innerHTML = this.Plants.length.toString();
        this.nowTime = 0;
        if(this.newSpeed !== 0){
            this.dayDuration = 1000 / this.newSpeed;
            this.speedSimulator = this.newSpeed;
            this.newSpeed = 0;
        }

        document.querySelector('#TimeEnd').innerHTML = parseInt(this.dayDuration).toString();

        if(this.pause){
            this.SysPause = true;
        }

        let data = new Data(this.data.animals, this.simulatorDays, this.Plants)
        this.chart_1.setData(data);
    }

    /**
     * Функция обновления
     * экрана
     * */
    update(){
        let newAnimals = [];

        for(let j = 0; j < this.speedSimulator; j++){
            for(let swarm in this.data.animals){
                if(this.data.animals[swarm].length <= 0)
                    delete this.data.animals[swarm];
                else
                    for(let i = 0; i < this.data.animals[swarm].length; i++){
                        let animal = this.data.animals[swarm][i];
                        if(animal.lifeStatus === 'died'){
                            this.countDie++;
                            animal.remove(this.ctx);
                            this.data.animals[swarm].splice(i,1);
                            continue;
                        }else{
                            this.countAlive++;
                            let newArr = animal.brain(this.ctx, this.canvas.width, this.canvas.height, this.data)
                            newAnimals = newAnimals.concat(newArr);
                        }
                        if(newAnimals.length !== 0 && i === this.data.animals[swarm].length - 1){
                            this.data.animals[swarm] = this.data.animals[swarm].concat(newAnimals);
                            newAnimals = [];
                            break;
                        }
                    }
            }

            for(let i = 0; i < this.data.plants.length; i++){
                let plant = this.data.plants[i];
                plant.grow(this.ctx, this.canvas.width, this.canvas.height);
            }
        }
    }

    /**
     * Функция отрисовки
     * сущностей
     * */
    drawAnimal(){
        let _this = this;

        _this.ctx.fillStyle ='#f1ebeb';
        _this.ctx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);

        this.data.plants.forEach(function (plant) {
            plant.drawEntity(_this.ctx);
        });

        for(let swarm in this.data.animals){
            for(let i = 0; i < this.data.animals[swarm].length; i++){
                let animal = this.data.animals[swarm][i];
                if(animal.lifeStatus === 'died'){
                    this.countDie++;
                    animal.remove(this.ctx);
                    this.data.animals[swarm].splice(i,1);
                    continue;
                }else{
                    this.countAlive++;
                    animal.drawEntity(_this.ctx);
                }
            }
        }
    }
}

/**
 * Случайное целое число
 * */
function randomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

/**
 * Случайное число
 * */
function randomNum(min, max) {
    return Number((min + Math.random() * (max + 1 - min)).toFixed(2));
}

/**
 * Генерация
 * уникальных
 * id
 * */
const uNumberString = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
