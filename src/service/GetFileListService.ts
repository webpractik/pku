import fs from 'fs';
import logger from '../logger';

// noinspection JSUnfilteredForInLoop
export class GetFileListService {
    protected files: any;

    goSignal() {
        try {
            const dirPath = 'files/in/';
            this.files = GetFileListService.getFileList(dirPath);

            if (this.files) {
                return this.files;
            } else {
                return 'Список файлов не был найден.';
            }
        } catch (e) {
            logger.error(e.message, e.trace);
            return 'Во время получения списка файлов произошла ошибка';
        }
    }

    private static getFileList = (dir: string) => {
        var files = fs
            .readdirSync(dir)
            .map(function (v) {
                return { name: v, time: fs.statSync(dir + v).mtime.getTime() };
            })
            .sort(function (a, b) {
                return a.time - b.time;
            })
            .map(function (v) {
                return v.name;
            });

        files = files.filter(item => !/(^|\/)\.[^\/\.]/g.test(item));
        return files;
    };
}
