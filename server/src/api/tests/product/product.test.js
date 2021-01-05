//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let File = require('../../models/file.model');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../../../index');
const path = require('path');

// Allows the middleware to think we're already authenticated.
server.request.isAuthenticated = function () {
    return true;
}

chai.use(chaiHttp);

//Our parent block
describe('Files', () => {
    beforeEach((done) => { //Before each test we empty the database
        File.remove({}, (err) => {

        });
        const uploadedFiles = [
            {
                originalFileName: "inventory.csv",
                fileName: "1609800263052-608434412-inventory.csv",
                mimeType: "application/vnd.ms-excel",
                file: {
                    data: Buffer.from("ImhhbmRsZSI7ImxvY2F0aW9uIjsiYW1vdW50Ig0KIjIteC1iZWF2aXRhLXZpdGFsa29zdC1wbHVzLWluc2hhcGUtYmlvbWVkLXNjaG9rb2xhZGUiOyJCRVJMSU4iOyIyMjUuMDAiDQoibnUzLWJlZWYtamVya3kiOyJLT0VMTiI7IjIwLjAwIg0KIm51My1iZWVmLWplciI7IktPRUxOIjsiMzAuMDAi", 'binary'),
                    contentType: 'application/vnd.ms-excel'
                },
                createdAt: "2021-01-04T21:50:31.936Z"
            },
            {
                originalFileName: "products.xml",
                fileName: "1609800241822-192874375-products.xml",
                mimeType: "text/xml",
                file: {
                    data: Buffer.from('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHByb2R1Y3RzPgogICAgPHByb2R1Y3Q+CiAgICAgICAgPGlkIHR5cGU9ImludGVnZXIiPjQzNjU4OTc0OTg3MDU8L2lkPgogICAgICAgIDx0aXRsZT4yIHggQkVBVklUQSBWaXRhbGtvc3QgKyBJblNoYXBlLUJpb21lZMKuIFNjaG9rb2xhZGUsIFB1bHZlcjwvdGl0bGU+CiAgICAgICAgPGJvZHktaHRtbD4yIHggQkVBVklUQSBWaXRhbGtvc3QgcGx1cyBJblNoYXBlLUJpb21lZMKuIFNjaG9rb2xhZGUsIFB1bHZlcjogRGllIGF1c2dld8OkaGx0ZW4gRGnDpHQtU2hha2VzIGbDvHIgZGVpbmVuIFdlZyB6dXIgVHJhdW1maWd1ciAtIGhpZXIgYmVpIG51ciBiZXN0ZWxsZW4uPC9ib2R5LWh0bWw+CiAgICAgICAgPHZlbmRvcj5CaW9tZWQ8L3ZlbmRvcj4KICAgICAgICA8cHJvZHVjdC10eXBlPlNsaW1taW5nPC9wcm9kdWN0LXR5cGU+CiAgICAgICAgPGNyZWF0ZWQtYXQgdHlwZT0iZGF0ZVRpbWUiPjIwMTktMTEtMTFUMjE6NTE6NTIrMDE6MDA8L2NyZWF0ZWQtYXQ+CiAgICAgICAgPGhhbmRsZT4yLXgtYmVhdml0YS12aXRhbGtvc3QtcGx1cy1pbnNoYXBlLWJpb21lZC1zY2hva29sYWRlPC9oYW5kbGU+CiAgICAgICAgPHB1Ymxpc2hlZC1zY29wZT53ZWI8L3B1Ymxpc2hlZC1zY29wZT4KICAgICAgICA8dGFncz5pbmdyZWRpZW50c19ub19nZWxhdGluZSwgaW5ncmVkaWVudHNfbm9fZ2x1dGVuLCBpbmdyZWRpZW50c19ub19wcmVzZXJ2YXRpdmVzLCBpbmdyZWRpZW50c192ZWdldGFyaWFuLCB0YXhfcmVkdWNlZDwvdGFncz4KICAgICAgICA8aW1hZ2U+CiAgICAgICAgICAgIDxpZCB0eXBlPSJpbnRlZ2VyIj4xNjMwODQ1NDYyMTI2NTwvaWQ+CiAgICAgICAgICAgIDxwcm9kdWN0LWlkIHR5cGU9ImludGVnZXIiPjQzNjU4OTc0OTg3MDU8L3Byb2R1Y3QtaWQ+CiAgICAgICAgICAgIDxjcmVhdGVkLWF0IHR5cGU9ImRhdGVUaW1lIj4yMDIwLTEyLTE5VDA0OjAyOjMzKzAxOjAwPC9jcmVhdGVkLWF0PgogICAgICAgICAgICA8dXBkYXRlZC1hdCB0eXBlPSJkYXRlVGltZSI+MjAyMC0xMi0xOVQwNDowMjozMyswMTowMDwvdXBkYXRlZC1hdD4KICAgICAgICAgICAgPHdpZHRoIHR5cGU9ImludGVnZXIiPjUyMjwvd2lkdGg+CiAgICAgICAgICAgIDxoZWlnaHQgdHlwZT0iaW50ZWdlciI+NTAwPC9oZWlnaHQ+CiAgICAgICAgICAgIDxzcmM+aHR0cHM6Ly9jZG4uc2hvcGlmeS5jb20vcy9maWxlcy8xLzAwOTUvMjI3NC8xMzI5L3Byb2R1Y3RzLzlfMjUyRmVfMjUyRmZfMjUyRmRfMjUyRjllZmQ1MWNlMmM5OTY4ZjU1OWY3ZmE1ZGZiYzI0OWI5NWM5YzIyNDVfMTc0NzhfYzU5Njg5N2UtMWY1NS00MmY0LWE3MWQtM2IyZDVhMTYzNzFjLmpwZz92PTE2MDgzNDY5NTM8L3NyYz4KICAgICAgICA8L2ltYWdlPgogICAgPC9wcm9kdWN0PgogICAgPHByb2R1Y3Q+CiAgICAgICAgPGlkIHR5cGU9ImludGVnZXIiPjQzNjQ3NzI1MDc3Mjk8L2lkPgogICAgICAgIDx0aXRsZT5udTMgQmVlZiBKZXJreTwvdGl0bGU+CiAgICAgICAgPGJvZHktaHRtbD5udTMgQmVlZiBKZXJreTogRGVpbiBoZXJ6aGFmdGVyIFByb3RlaW4tU25hY2sgYXVzIGhvY2h3ZXJ0aWdlbSBSaW5kZmxlaXNjaCB1bmQgcGlrYW50ZW4gR2V3w7xyemVuLiBKZXR6dCBudTMgVHJvY2tlbmZsZWlzY2ggYmVzdGVsbGVuITwvYm9keS1odG1sPgogICAgICAgIDx2ZW5kb3I+bnUzPC92ZW5kb3I+CiAgICAgICAgPHByb2R1Y3QtdHlwZT5TcG9ydHM8L3Byb2R1Y3QtdHlwZT4KICAgICAgICA8Y3JlYXRlZC1hdCB0eXBlPSJkYXRlVGltZSI+MjAxOS0xMS0xMVQxMjowOTo1MyswMTowMDwvY3JlYXRlZC1hdD4KICAgICAgICA8aGFuZGxlPm51My1iZWVmLWplcmt5PC9oYW5kbGU+CgogICAgICAgIDxwdWJsaXNoZWQtc2NvcGU+d2ViPC9wdWJsaXNoZWQtc2NvcGU+CiAgICAgICAgPHRhZ3M+YmFkZ2Vfc2V2ZXJhbF92YXJpYW50cywgaW5ncmVkaWVudHNfbm9fYXNwYXJ0YW0sIGluZ3JlZGllbnRzX25vX2ZsYXZvdXJfZW5oYW5jZXJzLCBpbmdyZWRpZW50c19ub19nZWxhdGluZSwgaW5ncmVkaWVudHNfbm9fZ2x1dGVuLCBpbmdyZWRpZW50c19ub19wcmVzZXJ2YXRpdmVzLCBxdWFsaXR5X25hdHVyYWxfaW5ncmVkaWVudHMsIHRheF9yZWR1Y2VkPC90YWdzPgogICAgICAgIDxpbWFnZT4KICAgICAgICAgICAgPGlkIHR5cGU9ImludGVnZXIiPjE2MzA3MTk5MzExOTUzPC9pZD4KICAgICAgICAgICAgPHByb2R1Y3QtaWQgdHlwZT0iaW50ZWdlciI+NDM2NDc3MjUwNzcyOTwvcHJvZHVjdC1pZD4KICAgICAgICAgICAgPHBvc2l0aW9uIHR5cGU9ImludGVnZXIiPjE8L3Bvc2l0aW9uPgogICAgICAgICAgICA8Y3JlYXRlZC1hdCB0eXBlPSJkYXRlVGltZSI+MjAyMC0xMi0xOFQyMjowMjoxMyswMTowMDwvY3JlYXRlZC1hdD4KICAgICAgICAgICAgPHVwZGF0ZWQtYXQgdHlwZT0iZGF0ZVRpbWUiPjIwMjAtMTItMThUMjI6MDI6MTMrMDE6MDA8L3VwZGF0ZWQtYXQ+CiAgICAgICAgICAgIDxhbHQgbmlsPSJ0cnVlIi8+CiAgICAgICAgICAgIDx3aWR0aCB0eXBlPSJpbnRlZ2VyIj40NDcyPC93aWR0aD4KICAgICAgICAgICAgPGhlaWdodCB0eXBlPSJpbnRlZ2VyIj40NDcyPC9oZWlnaHQ+CiAgICAgICAgICAgIDxzcmM+aHR0cHM6Ly9jZG4uc2hvcGlmeS5jb20vcy9maWxlcy8xLzAwOTUvMjI3NC8xMzI5L3Byb2R1Y3RzLzdfMjUyRmZfMjUyRmFfMjUyRmVfMjUyRjdmYWU2N2VjMzZhZmFlYzE4ZmQ1Y2MzYjZjNWUxNjNhNWMyOTU2OTFfbnUzX2JlZWZfamVya3lfMDZkOTE3MjYtNzc3NS00ODRlLWFkZjgtM2U1ZjFiZTMxMDlkLmpwZz92PTE2MDgzMjUzMzM8L3NyYz4KICAgICAgICA8L2ltYWdlPgogICAgPC9wcm9kdWN0Pgo8L3Byb2R1Y3RzPg==', 'binary'),
                    contentType: 'text/xml'
                },
                createdAt: "2021-01-04T21:50:38.816Z"
            }
        ];
        File.insertMany(uploadedFiles)
            .then(function () {
                console.log("Data inserted")
                done()// Success
            }).catch(function (error) {
            console.log(error)      // Failure
        });
    });

    /*
     * Test the /GET Uploaded Files
     */
    describe('/GET Uploaded Files', () => {
        it('it should GET all the uploaded files', (done) => {

            chai.request(server)
                .get('/v1/products/files')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(2);
                    done();
                });
        });
    });

    /*
     * Test the /GET Uploaded File
     */
    describe('/GET Uploaded File', () => {
        it('it shoul return xml file', (done) => {

            chai.request(server)
                .get('/v1/products/file/1609800241822-192874375-products.xml')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.be.equal('text/xml');
                    done();
                });
        });

        it('it shoul return csv file', (done) => {

            chai.request(server)
                .get('/v1/products/file/1609800263052-608434412-inventory.csv')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.type.should.be.equal('application/vnd.ms-excel');
                    done();
                });
        });

        it('it shoul return no content status code ', (done) => {

            chai.request(server)
                .get('/v1/products/file/unknown.csv')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });

    /*
     * Test the /GET Uploaded Files
     */
    describe('/POST Product Upload', () => {
        it('it should upload csv', (done) => {
            const filePath = path.join(__dirname, '../', '/test_files/' + '/1609713734793-192772317-inventory.csv')
            chai.request(server)
                .post('/v1/products/upload')
                .set('content-type', 'multipart/form-data')
                .attach('file', filePath, 'inventory.csv')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.status.should.be.equal('OK');
                    done();
                });
        });

        it('it should upload xml', (done) => {
            const filePath = path.join(__dirname, '../', '/test_files/' + '/1609714076536-881701105-products.xml')
            chai.request(server)
                .post('/v1/products/upload')
                .set('content-type', 'multipart/form-data')
                .attach('file', filePath, 'inventory.csv')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.status.should.be.equal('OK');
                    done();
                });
        });

        it('it should not upload unsupported media types', (done) => {
            const filePath = path.join(__dirname, '../', '/test_files/' + '/logo.png')
            chai.request(server)
                .post('/v1/products/upload')
                .set('content-type', 'multipart/form-data')
                .attach('file', filePath, 'inventory.csv')
                .end((err, res) => {
                    res.should.have.status(415);
                    res.body.code.should.be.equal(415);
                    res.body.message.should.be.equal('Unsupported Media Type');
                    done();
                });
        });
    });
});
