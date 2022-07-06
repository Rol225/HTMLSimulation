/**
 * Графики
 * для отображения
 * состояния системы
 * */
class Chart {
    allCharts = {};
    constructor(sizeX, id , container) {
        // Инициализация графиков
        this.Init(sizeX, id, container);
        this.tools();
        this.paintGrid();
    }

    /**
     * Инициализация
     * */
    Init(sizeX, id, container){
        const containerCharts = document.querySelector('#'+container);
        const sizeY = window.innerHeight;
        if(sizeX === 0)
            sizeX = window.innerWidth;

        containerCharts.style.height = '' + (sizeY + 20) + 'px';

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'chart_all'
        this.canvas.style.background="rgb(0 0 0 / 13%)";
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = sizeX;
        this.canvas.height = sizeY;

        const chart_speed = document.createElement('canvas');
        const chart_size = document.createElement('canvas');
        const chart_sensitivity = document.createElement('canvas');
        const chart_populations = document.createElement('canvas');

        containerCharts.appendChild(this.canvas);
        containerCharts.appendChild(chart_speed);
        containerCharts.appendChild(chart_size);
        containerCharts.appendChild(chart_sensitivity);
        containerCharts.appendChild(chart_populations);

        const AllCharts = {
            chart_speed: {
                el: chart_speed,
                ctx: chart_speed.getContext('2d'),
                des: 'График скорости',
                color: 'rgba(178,0,68,0.6)',
                id: 'chart_speed'
            },
            chart_size: {
                el: chart_size,
                ctx: chart_size.getContext('2d'),
                des: 'График размера',
                color: 'rgba(0,50,178,0.55)',
                id: 'chart_size'
            },
            chart_sensitivity: {
                el: chart_sensitivity,
                ctx: chart_sensitivity.getContext('2d'),
                des: 'График чувствительности',
                color: 'rgba(45,178,0,0.5)',
                id: 'chart_sensitivity'
            },
            chart_populations: {
                el: chart_populations,
                ctx: chart_populations.getContext('2d'),
                des: 'График популяции',
                color: 'rgba(255,112,0,0.45)',
                id: 'chart_populations'
            }
        };

        for(let chart in AllCharts){
            AllCharts[chart].el.id = AllCharts[chart].id;
            AllCharts[chart].el.width = sizeX;
            AllCharts[chart].el.height = sizeY;
        }

        this.allCharts = AllCharts;
    }

    /**
     * Чекбоксы для
     * показа графиков
     * */
    tools(){
        const toolBar = document.createElement('div');
        toolBar.classList.add('chartSelector');
        this.canvas.parentNode.parentNode.appendChild(toolBar);
        for(let chart in this.allCharts){
            let newItem = document.createElement('div');
            newItem.classList.add('chartSelector--item');
            let checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.id = 'checkBox' + this.allCharts[chart].id;
            checkBox.checked = true;
            checkBox.value = this.allCharts[chart].id;
            checkBox.classList.add('chartSelector--item-checkBox');
            let label = document.createElement('label');
            label.setAttribute('for', checkBox.id);
            label.innerHTML = this.allCharts[chart].des;
            newItem.appendChild(checkBox);
            newItem.appendChild(label);
            toolBar.appendChild(newItem);
        }
        toolBar.addEventListener('change', function (event) {
            toolBar.querySelectorAll('input').forEach(function (input) {
                if(input.checked){
                    toolBar.parentNode.querySelector('#'+ input.value)
                        .style.display = null;
                }else
                    toolBar.parentNode.querySelector('#'+ input.value)
                        .style.display = 'none';
            });
        });
    }

    /**
     * Подготовить данные
     * на отрисовку
     * */
    setData(data){
        const speed = data.getAnimalsSpeed();
        const size = data.getAnimalsSize();
        const sensitivity = data.getAnimalsSensitivity();
        const populations = data.getAnimalsPopulations();

        this.setPointer(data.days, speed, 'chart_speed');
        this.setPointer(data.days, size, 'chart_size');
        this.setPointer(data.days, sensitivity, 'chart_sensitivity');
        this.setPointer(data.days, populations, 'chart_populations');
    }

    /**
     * Поставить точку
     * */
    setPointer(dataX, dataY, chart){
        let pointWidthHeight = 5 / 2;
        let posX = dataX + 25 - pointWidthHeight;
        let posY = (this.canvas.height / 2) - dataY - pointWidthHeight;
        this.allCharts[chart].ctx.fillStyle = this.allCharts[chart].color;
        this.allCharts[chart].ctx.fillRect(posX, posY, 5, 5);
    }

    /**
     * Рисование
     * сетки
     * */
    paintGrid(){
        const scaleX = 10;
        const scaleY = 10;

        this.ctx.beginPath();
        this.ctx.strokeStyle ='rgba(255,255,255,0.1)';
        for (let i = 0; i < this.canvas.width; i += scaleX){
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
        }

        for (let i = 0; i < this.canvas.height; i += scaleY){
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
        }

        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.strokeStyle ='rgb(255,255,255)';
        this.ctx.moveTo(Math.round(this.canvas.width / 10 / 2) * 10, 0);
        this.ctx.lineTo(Math.round(this.canvas.width / 10 / 2) * 10, this.canvas.height);

        this.ctx.moveTo(0, Math.round(this.canvas.height / 10 / 2) * 10);
        this.ctx.lineTo(this.canvas.width, Math.round(this.canvas.height / 10 / 2) * 10);

        this.ctx.stroke();
        this.ctx.closePath();
    }
}
