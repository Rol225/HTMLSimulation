/**
 * Описание некоторой
 * квадратной
 * сущности
 * */
class Entity {
    constructor(x, y, size, id, color = 'rgba(0,0,0,0.5)', energy, sensitivity = 0) {
        this.setEntitySquare(x, y, size, sensitivity);
        this.color = color;
        this.id = id || 'entity';
        this.energy = energy;
    }

    /**
     * Столкновение
     * сущностей
     * */
    Conflict(anotherEntity){
        if(this && anotherEntity && this.x !== anotherEntity.x){
            if((this.angleTopRight.x >= anotherEntity.angleTopLeft.x && this.angleTopLeft.x <= anotherEntity.angleTopLeft.x) &&
                ((this.angleTopLeft.y <= anotherEntity.angleTopRight.y && anotherEntity.angleTopRight.y <= this.angleBottomLeft.y) ||
                    (this.angleTopLeft.y <= anotherEntity.angleBottomRight.y && anotherEntity.angleBottomRight.y <= this.angleBottomLeft.y)) ||
                (this.angleTopLeft.x <= anotherEntity.angleTopRight.x && this.angleTopLeft.x >= anotherEntity.angleTopLeft.x) &&
                ((this.angleTopRight.y <= anotherEntity.angleTopLeft.y && anotherEntity.angleTopLeft.y <= this.angleBottomRight.y) ||
                    (this.angleTopRight.y <= anotherEntity.angleBottomLeft.y && anotherEntity.angleBottomLeft.y <= this.angleBottomRight.y))){

                return true;
            }
        }
        if(this && anotherEntity && this.y !== anotherEntity.y){
            if((this.angleTopLeft.y <= anotherEntity.angleBottomLeft.y && this.angleTopLeft.y >= anotherEntity.angleTopLeft.y) &&
                ((this.angleTopLeft.x <= anotherEntity.angleBottomLeft.x && anotherEntity.angleBottomLeft.x <= this.angleTopRight.x) ||
                    (this.angleTopLeft.x <= anotherEntity.angleBottomRight.x && anotherEntity.angleBottomRight.x <= this.angleTopRight.x)) ||
                (this.angleBottomLeft.y >= anotherEntity.angleTopLeft.y && this.angleBottomLeft.y <= anotherEntity.angleBottomLeft.y) &&
                ((this.angleBottomLeft.x <= anotherEntity.angleTopLeft.x && anotherEntity.angleTopLeft.x <= this.angleBottomRight.x) ||
                    (this.angleBottomLeft.x <= anotherEntity.angleTopRight.x && anotherEntity.angleTopRight.x <= this.angleBottomRight.x))){

                return true
            }
        }
        if(this && anotherEntity && this.y === anotherEntity.y && this.x === anotherEntity.x){
            return true;
        }
        return false;
    }


    /**
     * Нарисовать
     * сущность
     * */
    drawEntity(ctx, color = this.color){
        ctx.fillStyle = color;
        ctx.fillRect (this.x, this.y, this.size, this.size);
    }

    /**
     * Стереть
     * сущность
     * */
    eraseEntity(ctx){
        ctx.fillStyle = '#f1ebeb';
        ctx.fillRect (this.x, this.y, this.size, this.size);
    }

    /**
     * Перерисовать
     * сущность
     * */
    redrawEntity(ctx, color, width, height){
        this.eraseEntity(ctx);
        this.setEntitySquare(randomInteger(25, width - 20), randomInteger(25, height - 20), 5)
        this.color = color;
        this.drawEntity(ctx);
    }

    /**
     * Выставить
     * параметры площади
     * сущности, а также его
     * перемещение
     * */
    setEntitySquare(x, y, size = this.size, sensitivity = 0){
        this.x = x;
        this.y = y;
        this.size =  Number(size.toFixed(2));
        this.angleTopLeft = {x: Number((x - sensitivity - size).toFixed(2)), y: Number((y - sensitivity - size).toFixed(2))};
        this.angleTopRight = {x: Number((x + sensitivity + size).toFixed(2)), y: Number((y - sensitivity - size).toFixed(2))};
        this.angleBottomLeft = {x: Number((x - sensitivity - size).toFixed(2)), y: Number((y + sensitivity + size).toFixed(2))};
        this.angleBottomRight = {x: Number((x + sensitivity + size).toFixed(2)), y: Number((y + sensitivity + size).toFixed(2))};
    }

}
