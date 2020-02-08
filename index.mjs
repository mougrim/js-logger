/**
 * @author Mougrim <rinat@mougrim.ru>
 * @module mougrim/logger/Logger
 */
'use strict';

import cloneDeep from './clone-deep.mjs';

/**
 * @memberOf module:mougrim/logger/Logger
 */
export default class Logger {
    /**
     * @public
     * @return {number}
     */
    static get LEVEL_OFF() {
        return 120000;
    }

    /**
     * @public
     * @return {number}
     */
    get LEVEL_OFF() {
        return this.constructor.LEVEL_OFF;
    }

    /**
     * @public
     * @return {number}
     */
    static get LEVEL_CRITICAL() {
        return 60000;
    }

    /**
     * @public
     * @return {number}
     */
    get LEVEL_CRITICAL() {
        return this.constructor.LEVEL_CRITICAL;
    }

    /**
     * @public
     * @return {number}
     */
    static get LEVEL_ERROR() {
        return 50000;
    }

    /**
     * @public
     * @return {number}
     */
    get LEVEL_ERROR() {
        return this.constructor.LEVEL_ERROR;
    }

    /**
     * @public
     * @return {number}
     */
    static get LEVEL_WARNING() {
        return 40000;
    }

    /**
     * @public
     * @return {number}
     */
    get LEVEL_WARNING() {
        return this.constructor.LEVEL_WARNING;
    }

    /**
     * @public
     * @return {number}
     */
    static get LEVEL_NOTICE() {
        return 30000;
    }

    /**
     * @public
     * @return {number}
     */
    get LEVEL_NOTICE() {
        return this.constructor.LEVEL_NOTICE;
    }

    /**
     * @public
     * @return {number}
     */
    static get LEVEL_INFO() {
        return 20000;
    }

    /**
     * @public
     * @return {number}
     */
    get LEVEL_INFO() {
        return this.constructor.LEVEL_INFO;
    }

    /**
     * @public
     * @return {number}
     */
    static get LEVEL_DEBUG() {
        return 10000;
    }

    /**
     * @public
     * @return {number}
     */
    get LEVEL_DEBUG() {
        return this.constructor.LEVEL_DEBUG;
    }

    /**
     * @public
     * @return {number}
     */
    static get LEVEL_ALL() {
        return 0;
    }

    /**
     * @public
     * @return {number}
     */
    get LEVEL_ALL() {
        return this.constructor.LEVEL_ALL;
    }

    /**
     * @protected
     * @return {Map}
     */
    static get LEVELS_MAP() {
        if (this._LEVELS_MAP === undefined) {
            /**
             * @type {Map}
             * @private
             */
            this._LEVELS_MAP = new Map([
                ['critical', this.LEVEL_CRITICAL],
                ['error', this.LEVEL_ERROR],
                ['warning', this.LEVEL_WARNING],
                ['notice', this.LEVEL_NOTICE],
                ['info', this.LEVEL_INFO],
                ['debug', this.LEVEL_DEBUG],
            ]);
        }
        return this._LEVELS_MAP;
    }

    /**
     * @protected
     * @return {Map}
     */
    get LEVELS_MAP() {
        return this.constructor.LEVELS_MAP;
    }

    /**
     * @protected
     * @param {String} levelString
     * @return {Number}
     */
    static levelToInt(levelString) {
        const levelsMap = this.LEVELS_MAP;
        if (!levelsMap.has(levelString)) {
            this.logFallback(`Unknown logger level '${levelString}'`);
            return this.LEVEL_OFF;
        }
        return levelsMap.get(levelString);
    }

    /**
     * Get logger by name
     * @param {String} name
     * @returns {module:mougrim/logger/Logger.Logger}
     */
    static getLogger(name) {
        if (this.loggers === undefined) {
            /**
             * @private
             * @type {{}}
             */
            this.loggers = {};
        }
        if (this.config === undefined) {
            /**
             * @private
             * @type {{defaultLoggerConfig: {[minLevel]: Number, [maxLevel]: Number}, loggers: Object.<String, {[minLevel]: Number, [maxLevel]: Number}>}}
             */
            this.config = {};
        }
        if (this.config.defaultLoggerConfig === undefined) {
            this.config.defaultLoggerConfig = {
                'minLevel': this.LEVEL_NOTICE,
            };
        }
        if (this.config.loggers === undefined) {
            this.config.loggers = {};
        }
        if (this.loggers[name] === undefined) {
            this.loggers[name] = new this(name);
            let loggerConfig;
            if (this.config.loggers[name] !== undefined) {
                loggerConfig = this.config.loggers[name];
                for (const configKey in this.config.defaultLoggerConfig) {
                    if (this.config.defaultLoggerConfig[configKey] !== undefined && loggerConfig[configKey] === undefined) {
                        loggerConfig[configKey] = this.config.defaultLoggerConfig[configKey];
                    }
                }
            } else {
                loggerConfig = this.config.defaultLoggerConfig;
            }
            for (const configKey in loggerConfig) {
                if (loggerConfig[configKey] !== undefined) {
                    const setter = `set${configKey[0].toUpperCase()}${configKey.slice(1)}`;
                    this.loggers[name][setter](loggerConfig[configKey]);
                }
            }
        }

        return this.loggers[name];
    }

    /**
     * @public
     * @param {{[defaultLoggerConfig]: {[minLevel]: Number, [maxLevel]: Number}, [loggers]: Object.<String, {[minLevel]: Number, [maxLevel]: Number}>}} config
     */
    static configure(config) {
        this.config = config;
    }

    /**
     * @protected
     * @param {String} name
     */
    constructor(name) {
        /**
         * @private
         * @type {String}
         */
        this.name = name;
        /**
         * @private
         * @type {Number}
         */
        this.minLevel = Logger.LEVEL_OFF;
        /**
         * @private
         * @type {Number}
         */
        this.maxLevel = Logger.LEVEL_OFF;
    }

    /**
     * @public
     * @returns {String} logger name
     */
    getName() {
        return this.name;
    }

    /**
     * @public
     * @returns {Number} min log level
     */
    getMinLevel() {
        return this.minLevel;
    }

    /**
     * Set min log level
     * @public
     * @param {Number} minLevel
     * @return {module:mougrim/logger/Logger.Logger}
     */
    setMinLevel(minLevel) {
        this.minLevel = minLevel;
        return this;
    }

    /**
     * @public
     * @returns {Number} max log level
     */
    getMaxLevel() {
        return this.maxLevel;
    }

    /**
     * Set max log level
     * @public
     * @param {Number} maxLevel
     * @return {module:mougrim/logger/Logger.Logger}
     */
    setMaxLevel(maxLevel) {
        this.maxLevel = maxLevel;
        return this;
    }
    /**
     * @public
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    critical(message, context) {
        this.log('critical', message, context);
    }

    /**
     * @public
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    error(message, context) {
        this.log('error', message, context);
    }

    /**
     * @public
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    warning(message, context) {
        this.log('warning', message, context);
    }

    /**
     * @public
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    notice(message, context) {
        this.log('notice', message, context);
    }

    /**
     * @public
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    info(message, context) {
        this.log('info', message, context);
    }

    /**
     * @public
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    debug(message, context) {
        this.log('debug', message, context);
    }

    /**
     * @public
     * @param {String} levelString
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    log(levelString, message, context) {
        const level = Logger.levelToInt(levelString);
        if (this.getMinLevel() > level || this.getMaxLevel() < level) {
            return;
        }
        if (!(message instanceof Array)) {
            message = new Array(message);
        }

        if (context !== undefined) {
            message.push('Context: ');
            message.push(context);
        }

        const date = new Date();
        const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        console.log(`[${dateString}] ${this.getName()}.${levelString}`, cloneDeep(message)); // jshint ignore:line
    }

    /**
     * @private
     * @param message
     */
    static logFallback(message) {
        console.log(new Error(message)); // jshint ignore:line
    }
}
