/**
 * @author Mougrim <rinat@mougrim.ru>
 */
'use strict';

import cloneDeep from './clone-deep.mjs';

/**
 * @class Logger
 */
export default class Logger {
    static get LEVEL_OFF() {
        return 120000;
    }

    get LEVEL_OFF() {
        return this.constructor.LEVEL_OFF;
    }

    static get LEVEL_CRITICAL() {
        return 60000;
    }

    get LEVEL_CRITICAL() {
        return this.constructor.LEVEL_CRITICAL;
    }

    static get LEVEL_ERROR() {
        return 50000;
    }

    get LEVEL_ERROR() {
        return this.constructor.LEVEL_ERROR;
    }

    static get LEVEL_WARNING() {
        return 40000;
    }

    get LEVEL_WARNING() {
        return this.constructor.LEVEL_WARNING;
    }

    static get LEVEL_NOTICE() {
        return 30000;
    }

    get LEVEL_NOTICE() {
        return this.constructor.LEVEL_NOTICE;
    }

    static get LEVEL_INFO() {
        return 20000;
    }

    get LEVEL_INFO() {
        return this.constructor.LEVEL_INFO;
    }

    static get LEVEL_DEBUG() {
        return 10000;
    }

    get LEVEL_DEBUG() {
        return this.constructor.LEVEL_DEBUG;
    }

    static get LEVEL_ALL() {
        return 0;
    }

    get LEVEL_ALL() {
        return this.constructor.LEVEL_ALL;
    }

    /**
     * @protected
     * @return {Map}
     */
    static get LEVELS_MAP() {
        if (!this.hasOwnProperty('_LEVELS_MAP')) {
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
     * @returns {Logger}
     */
    static getLogger(name) {
        if (!this.hasOwnProperty('loggers')) {
            /**
             * @private
             * @type {{}}
             */
            this.loggers = {};
        }
        if (!this.hasOwnProperty('config')) {
            /**
             * @private
             * @type {{defaultLoggerConfig: {minLevel: Number, maxLevel: Number}, loggers: Object.<String, {minLevel: Number, maxLevel: Number}>}}
             */
            this.config = {};
        }
        if (!this.config.hasOwnProperty('defaultLoggerConfig')) {
            this.config.defaultLoggerConfig = {
                'minLevel': this.LEVEL_NOTICE,
            };
        }
        if (!this.config.hasOwnProperty('loggers')) {
            this.config.loggers = {};
        }
        if (!this.loggers.hasOwnProperty(name)) {
            this.loggers[name] = new this(name);
            let loggerConfig;
            if (this.config.loggers.hasOwnProperty(name)) {
                loggerConfig = this.config.loggers[name];
                for (const configKey in this.config.defaultLoggerConfig) {
                    if (this.config.defaultLoggerConfig.hasOwnProperty(configKey) && !loggerConfig.hasOwnProperty(configKey)) {
                        loggerConfig[configKey] = this.config.defaultLoggerConfig[configKey];
                    }
                }
            } else {
                loggerConfig = this.config.defaultLoggerConfig;
            }
            for (const configKey in loggerConfig) {
                if (loggerConfig.hasOwnProperty(configKey)) {
                    const setter = `set${configKey[0].toUpperCase()}${configKey.slice(1)}`;
                    this.loggers[name][setter](loggerConfig[configKey]);
                }
            }
        }

        return this.loggers[name];
    }

    /**
     * @param {{defaultLoggerConfig: {minLevel: Number, maxLevel: Number}, loggers: Object.<String, {minLevel: Number, maxLevel: Number}>}} config
     */
    static configure(config) {
        this.config = config;
    }

    /**
     * @param {String} name
     * @constructor
     * @class Logger
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
     * @returns {String} logger name
     */
    getName() {
        return this.name;
    }

    /**
     * @returns {Number} min log level
     */
    getMinLevel() {
        return this.minLevel;
    }

    /**
     * Set min log level
     * @param {Number} minLevel
     * @return {Logger}
     */
    setMinLevel(minLevel) {
        this.minLevel = minLevel;
        return this;
    }

    /**
     * @returns {Number} max log level
     */
    getMaxLevel() {
        return this.maxLevel;
    }

    /**
     * Set max log level
     * @param {Number} maxLevel
     * @return {Logger}
     */
    setMaxLevel(maxLevel) {
        this.maxLevel = maxLevel;
        return this;
    }
    /**
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    critical(message, context) {
        this.log('critical', message, context);
    }

    /**
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    error(message, context) {
        this.log('error', message, context);
    }

    /**
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    warning(message, context) {
        this.log('warning', message, context);
    }

    /**
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    notice(message, context) {
        this.log('notice', message, context);
    }

    /**
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    info(message, context) {
        this.log('info', message, context);
    }

    /**
     * @param {[]|*} message messages and variables array
     * @param {[]|{}|Map} [context]
     */
    debug(message, context) {
        this.log('debug', message, context);
    }

    /**
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
