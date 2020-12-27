const fs = require('fs');
const path = require('path');

class Cart {
    static async add (course){
        const cart = await Cart.fetch();
        const courseIndex = cart.courses.findIndex (item => item.id === course.id);

        if (courseIndex !== -1) {
            cart.courses[courseIndex].count++;
        }
        else {
            cart.courses.push({...course, count: 1});
        }

        cart.price += Number.parseInt(course.price);

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'database', 'cart.json'),
                JSON.stringify(cart),
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }
            )
        });
    }

    static async delete(id) {
        const cart = await Cart.fetch();
        const candidateIndex = cart.courses.findIndex(item => item.id === id);

        cart.price -= Number.parseInt(cart.courses[candidateIndex].price);

        if (cart.courses[candidateIndex].count > 1) {
            cart.courses[candidateIndex].count--;
        }
        else {
            cart.courses.splice(candidateIndex, 1);
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(
                path.join(__dirname, '..', 'database', 'cart.json'),
                JSON.stringify(cart),
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(cart);
                    }
                }
            )
        });
    }

    static async fetch (){
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'database', 'cart.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(JSON.parse(content));
                }
            )
        });
    }
}

module.exports = Cart;