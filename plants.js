class Plants extends Entity{
    constructor(x, y, size, id, energy) {
        super(x, y, size, id, '#53d91e', energy);
        this.lifeStatus = 'alive';
        this.energyDo = energy;
    }

    /**
     * Удаление
     * растения
     * */
    remove(ctx){
        this.eraseEntity(ctx);
        this.x = -1000000;
        this.y = -1000000;
        this.angleTopLeft = {x: this.x, y: this.y};
        this.angleTopRight = {x: this.x, y: this.y};
        this.angleBottomLeft = {x: this.x, y: this.y};
        this.angleBottomRight = {x: this.x, y: this.y};
        this.size = 0;
    }

    /**
     * Перерисовать
     * растение
     * */
    reInit(ctx, width, height){
        this.lifeStatus = 'alive';
        this.redrawEntity(ctx, 'green', width, height);
    }

    /**
     * Рост растения
     * */
    grow(ctx, width, height){
        this.energy++;
        if(this.energy >= (this.energyDo + this.energyDo/30)){
            this.energy = this.energyDo;
            this.reInit(ctx, width, height);
        }
    }
}
