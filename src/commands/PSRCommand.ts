import { Command } from 'commander';
import AbstractCommand from './interface/AbstractCommand';
import { PsrService } from '../service/PsrService';
import { FileCollection } from '../files/FileCollection';
import CliException from '../exceptions/CliException';
import { CommandLogger } from '../logger';

// noinspection HtmlDeprecatedTag
/**
 * Команда критериев
 * Возвращает json расчет критериев из пакета критериев
 */
class PSRCommand extends AbstractCommand {
    name: string = 'psr';
    description: string = 'Команда расчета метрик';

    protected bindOptions(command: Command) {
        command.option('--fileId <fileId...>', 'перечень id файла в папке files/custom');
        command.option(
            '--filePath <filePath...>',
            'перечень путей к файлу относительно папки files | --filePath myDir/filepathWithExtension.json',
            false
        );
        command.option(
            '--dir <dir>',
            'параметр директории, из которой необходимо считывать файлы',
            'files/custom/'
        );
    }

    /**
     * Обработка команды
     *
     * @param options
     */
    protected action = (options: FileOptions) => {
        this.validateOptions(options);
        try {
            let fileCollection = new FileCollection(options);
            let server = new PsrService(fileCollection);
            console.log(server.getResult());
        } catch (e) {
            CommandLogger.error(
                'Во время расчёта метрик с помощью ПСР произошла ошибка.' + '\n' + e.message
            );
            process.exit(1);
        }
    };

    protected validateOptions(options: FileOptions) {
        if (!options.fileId && !options.filePath) {
            throw new CliException('Обязательные параметры не были заполнены.');

            if (options.fileId) {
                //@ts-ignore
                options.fileId.forEach((value, index, array) => {
                    if (value <= 0 || isNaN(value)) {
                        throw new CliException('параметры fileId должны быть числами');
                    }
                });
            }
        }
    }
}

export default PSRCommand;
