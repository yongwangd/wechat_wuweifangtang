let mysql = require('mysql');
let {promisify} = require('./commonUtils');

let con = mysql.createConnection({
    host: 'yong-nuc',
    user: 'root',
    password: '1234',
    database: 'wind'
});


// con.query('select * from douban_movies', (err, result) => console.log(err, result));


class SQLAccess {
    constructor(host = 'yong-nuc', user = 'root', password = '1234', database = 'wind') {
        this.con = mysql.createConnection({
            host: 'yong-nuc',
            user: 'root',
            password: '1234',
            database: 'wind'
        });
    }

    findAll(tablename) {
        return promisify(con.query, con)(`select * from ${tablename}`);
    }

    query(q) {
        return promisify(con.query, con)(q);
    }

    find(tablename, cond) {
    	return promisify(con.query, con)(`select * from ${tablename} where ?`, cond);
    }

    findOne(tablename, cond) {
        return promisify(con.query, con)(`select * from ${tablename} where ?`, cond).then(items => items[0]);
    }

    insert(tablename, item) {
    	return promisify(con.query, con)(`insert into ${tablename} SET ?`, item)
    }

    deletex(tablename, cond) {
        if(item == null) return Promise.reject('no con in delete')
        return promisify(con.query, con)(`delete from ${tablename} where ?`, cond)
    }

}

module.exports = SQLAccess;
