import fs from 'fs';
import path from 'path';

const FILEPATH = path.resolve('helper', 'lastTweet.json');

export default {
    lastTweet: 0,
    read() {
        let file = JSON.parse(fs.readFileSync(FILEPATH));
        this.lastTweet = file.lastTweet;
    },
    write(id) {
        fs.writeFile(FILEPATH, JSON.stringify({lastTweet: this.lastTweet}, null, 2), err => {
            if (err) {
                throw err;
            }
        });
    },
    set(id) {
        this.lastTweet = id;
        this.write();
    },
    get() {
        if(!this.lastTweet) {
            this.read();
        }

        return this.lastTweet;
    }
};