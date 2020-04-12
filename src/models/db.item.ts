const uuidv4 = require('uuid/v4');

export class DbItem {

    id: string | undefined;

    constructor(data: any | undefined){
        if (typeof data !== 'undefined') {
            this.id = data.id;
        }
    }    

    generateId(): void {
        this.id = uuidv4();
    }

    isEmpty(): boolean {
        for (let data in this){
            if (typeof this[data] !== 'undefined'){
                return false;
            }
        }
        return true;
     }

    valuesToString(): string {
        var str = "";
        for (let key of Object.keys(this)){
            if (typeof this[key] !== "undefined"){
                if (str !== "") str += ", ";
                if (key !== "id") {
                    if (typeof this[key] === "boolean") {
                        str+= key + " = " + ((this[key])? 1 : 0);
                    } else {
                        str+= key + " = '" + this[key] + "'";
                    }
                } 
            }
        }
        return str;
    }

    whereSimilarString(): string {
        var str = '';
        for (let key of Object.keys(this)) {
            if (typeof this[key] !== 'undefined') {
                if (str !== '') str += ', ';
                if (key === 'id') continue;
                if (typeof this[key] === 'boolean') {
                    str += key + " = " + ((this[key] ? 1 : 0));
                    continue;
                }
                str += "UPPER(" + key + ") LIKE UPPER('%" + this[key] + "%')"; 
            }
        }
        return str;
    }
    
    listKeys(): string{
       var str = "";
       for (let data of Object.keys(this)){
           if (typeof this[data]!= "undefined"){
               if (str != "") str += ", " + data ;
               else str += data ;
           }
       }
       return str;
    }

    listValues(): string{
       var str = "";
       for (let data of Object.keys(this)) {
           if (typeof this[data]!= "undefined") {
                if (typeof this[data] === "boolean") {
                    if (str != "") str += ", " + ((this[data])? 1 : 0);
                    else str += "\'" + ((this[data])? 1 : 0) + "\'";
                } else {
                    if (str != "") str += ", \'" + this[data] + "\'";
                    else str += "\'" + this[data] + "\'";
                }
           }
       }
       return str;
    }

    whereString(): string {
        var str = "";
        for (let data of Object.keys(this)){
            if (typeof this[data] != "undefined") {
                if (typeof this[data] === "number") {
                    if (str != "") str += " AND " + data + " = '" + this[data] + "'";
                    else str += data + " = " + this[data];
                } else if (typeof this[data] === "boolean") {
                    if (str != "") str += " AND " + data + " = '" + ((this[data])? 1 : 0) + "'";
                    else str += data + " = " + this[data];
                } else {
                    if (str != "") str += " AND " + data + " = '" + this[data] + "'";
                    else str += data + " = '" + this[data] + "'";
                }
            }
        }
        if (str == "") str = "1";
        return str;
    }

    updateValues(updates: DbItem): void {
        for (let key of Object.keys(updates)) {
            if (key !== 'id') this[key] = updates[key];
        }
    }
}