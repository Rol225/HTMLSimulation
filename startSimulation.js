let ENERGY_COST = 0;
let SIZE = 1;
let SPEED = 1;

function checkForm(e) {
    // Элементы настройки симуляции
    const SimulatorWidthEl = document.querySelector('#SimulatorWidth');
    const SimulatorHeightEl = document.querySelector('#SimulatorHeight');

    const CountAnimalEl = document.querySelector('#CountAnimal');
    const SimulatorSpeedEl = document.querySelector('#SimulatorSpeed');
    const SimulatorIterationsEl = document.querySelector('#SimulatorIterations');

    const SimulatorSpeedModifierEl = document.querySelector('#SimulatorSpeedModifier');
    const SimulatorSizeModifierEl = document.querySelector('#SimulatorSizeModifier');
    const SimulatorReproductionModifierEl = document.querySelector('#SimulatorReproductionModifier');

    // Значения настройки симуляции
    const SimulatorWidth = Number(SimulatorWidthEl.value);
    const SimulatorHeight = Number(SimulatorHeightEl.value);

    const CountAnimal = Number(CountAnimalEl.value);
    const SimulatorSpeed = Number(SimulatorSpeedEl.value);
    const SimulatorIterations = Number(SimulatorIterationsEl.value);

    const SimulatorSpeedModifier = Number(SimulatorSpeedModifierEl.value);
    const SimulatorSizeModifier = Number(SimulatorSizeModifierEl.value);
    const SimulatorReproductionModifier = Number(SimulatorReproductionModifierEl.value);

    let flag = true;

    // Проверка настроек симуляции
    if(CountAnimal < 1 || CountAnimal > 50){
        CountAnimalEl.value = null; flag = false;
    }
    if(SimulatorSpeed < 1 || SimulatorSpeed > 10){
        SimulatorSpeedEl.value = null; flag = false;
    }
    if(SimulatorSpeed < 1 || SimulatorSpeed > 10){
        SimulatorSpeedEl.value = null; flag = false;
    }

    if(SimulatorSpeedModifier > 2){
        SimulatorSpeedModifierEl.value = null; flag = false;
    }
    if(SimulatorSizeModifier > 10){
        SimulatorSizeModifierEl.value = null; flag = false;
    }
    if(SimulatorReproductionModifier > 10){
        SimulatorReproductionModifierEl.value = null; flag = false;
    }

    if(flag){
        e.target.parentNode.style.display = 'none';
        startSimulator(
            SimulatorWidth,
            SimulatorHeight,
            CountAnimal,
            SimulatorSpeed,
            SimulatorIterations,
            SimulatorSpeedModifier,
            SimulatorSizeModifier,
            SimulatorReproductionModifierEl);
    }

}

function startSimulator(SimulatorWidth, SimulatorHeight, CountAnimal, SimulatorSpeed, SimulatorIterations, SimulatorSpeedModifier, SimulatorSizeModifier, SimulatorReproductionModifierEl) {
    document.querySelector('main').style.display = 'block';

    ENERGY_COST = Math.floor(SimulatorWidth * SimulatorHeight / 5);
    if(SimulatorSizeModifier !== 0)
        SIZE = SimulatorSizeModifier;
    if(SimulatorSpeedModifier !== 0)
        SPEED = SimulatorSpeedModifier;

    let AnimalsArray = {};
    let plants = [];

    let size = 5;
    let speed = 2;
    let energy = Math.floor(((size * size * speed * speed)) * ENERGY_COST);
    for(let i = 0; i < CountAnimal; i++){
        let id = uNumberString();
        let animal = [];

        animal.push(new Animal(
            randomInteger(20, SimulatorWidth - 20),
            randomInteger(20, SimulatorHeight - 20),
            size,
            "#" + ((1<<24)*Math.random() | 0).toString(16),
            energy,
            10,
            speed,
            id));
        AnimalsArray[id] = animal;
    }


    for(let i = 0; i < CountAnimal * 8; i ++){
        let plant =  new Plants(
            randomInteger(25, SimulatorWidth - 20),
            randomInteger(25, SimulatorHeight - 20),
            5, ('plant_ ' + (i+1)),
            (Math.floor(energy / 6)));
        plants.push(plant);
    }


    const newSimulator = new Simulator('tutorial', SimulatorWidth, SimulatorHeight, SimulatorSpeed, AnimalsArray, plants, SimulatorIterations);
}

