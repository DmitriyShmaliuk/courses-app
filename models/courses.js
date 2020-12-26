const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');

class Course {
    constructor(name, price, image) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.id = uuid();
    }

    async save() {
        const courses = await Course.getAll();
        courses.push({
            ...this
        });

        fs.writeFile(
            path.join(__dirname, '..', 'database', 'courses.json'),
            JSON.stringify(courses),
            (err) => {
                if (err) {
                    throw new Error(err);
                }
            }  
        )
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '..', 'database', 'courses.json'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(JSON.parse(content));
                    }
                }
            )
        });
    }

    static async getById(id) {
        const courses = await Course.getAll();
        const course = courses.find(course => course.id === id);

        return course;
    }

    static async update({name, price, image, id}){
        const courses = await Course.getAll();
        const course = courses.find(course => course.id === id);

        course.name = name;
        course.price = price;
        course.image = image;

        fs.writeFile(
            path.join(__dirname, '..', 'database', 'courses.json'),
            JSON.stringify(courses),
            (err) => {
                if (err) {
                    throw new Error(err);
                }
            }  
        )
    }
}

module.exports = Course;