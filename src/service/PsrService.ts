//@ts-ignore
import MetricService from '@upgreat-readable/psr';
import { FileCollection } from '../files/FileCollection';
import { File } from '../files/File';

// noinspection JSUnfilteredForInLoop
export class PsrService {
    protected fileCollection: FileCollection;

    protected readyObject: object;

    /**
     * Объект эссе в заданном виде
     * @param fileCollection
     */
    constructor(fileCollection: FileCollection) {
        this.fileCollection = fileCollection;
        let readyToPsrEntity = this.implodeFilesToPsrFormat(this.fileCollection.files);
        this.readyObject = new MetricService().calculate(readyToPsrEntity);
    }

    public getResult(): string {
        return JSON.stringify(this.readyObject, null, 2);
    }

    public getResultObject() {
        return this.readyObject;
    }

    implodeFilesToPsrFormat(files: File[]) {
        if (files.length === 1) {
            throw new Error('Ошибка. ПСР был запущен для одной разметки.');
        }

        let PsrObject: any = {
            essay: {
                id: '',
                meta: {},
                text: '',
                markups: [],
            },
        };

        files.forEach((value, index, array) => {
            /* Считываем контент из файла */
            let jsonContent = value.getJson();
            if (index === 0) {
                PsrObject.essay.id = 'test-id-essay';
                PsrObject.essay.meta = jsonContent.meta;
                PsrObject.essay.text = jsonContent.text;
            }

            let expertMark = false;
            if (jsonContent.meta.expert) {
                expertMark = true;
            }

            PsrObject.essay.markups.push({
                id: 1,
                isExpert: expertMark,
                third: false,
                criteria: jsonContent.criteria,
                selections: jsonContent.selections,
            });
        });

        return PsrObject;
    }
}
