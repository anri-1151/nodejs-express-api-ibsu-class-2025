const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;

const app = require('../app');

const fs = require('fs');
const dotenv = require('dotenv');
const configData = fs.readFileSync('.testing.env');
const buf = Buffer.from(configData);
const config = dotenv.parse(buf);
const mongoose = require('mongoose');

//set test environment
app.set('port', config.port);


describe('check db connection', () => {
    process.env.SECRET_KEY = 'jwtSectretKey';
    before(async function () {
        await mongoose.connect(`${config.MONGO_URI}`);
    });
    describe('authorization scenarios', () => {
        it('wrong username and wrong password', (done) => {
            chai.request(app)
                .post('/users/login')
                .send({ username: 'tst@tr.ge', password: '123' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    done()
                });
        });
        it('wrong username and correct password', (done) => {
            chai.request(app)
                .post('/users/login')
                .send({ username: 'tst@tr.ge', password: '1234' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    done()
                });
        });
        it('correct username and wrong password', (done) => {
            chai.request(app)
                .post('/users/login')
                .send({ username: 'test21@example.com', password: '1234' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    done()
                });
        });
        it('correct username and correct password', (done) => {
            chai.request(app)
                .post('/users/login')
                .send({ username: 'test@example.com', password: '123456' })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    setImmediate(done);
                });
        });
    });

});