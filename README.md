This is Mougrim logger library.

Main theme - light and fast library, with simple configuring.

[![Latest Stable Version](https://img.shields.io/npm/v/mougrim-logger.svg)](https://npmjs.org/package/mougrim-logger)

## Configuration

```js
import Logger from 'mougrim-logger';

Logger.configure({
    defaultLoggerConfig: {
        minLevel: Logger.LEVEL_NOTICE,
    },
    loggers: {
        foo: {
            maxLevel: Logger.LEVEL_NOTICE,
        },
        bar: {
            minLevel: Logger.LEVEL_INFO,
            maxLevel: Logger.LEVEL_NOTICE,
        }
    },
});
```

## Logging

```js
import Logger from 'mougrim-logger';

let logger = Logger.getLogger('foo'); // minLevel will be from default config, maxLevel will be from loggers config
logger.debug('debug message', {foo: 'bar'}); // will be skipped
logger.info('info message', {foo: 'bar'}); // will be skipped
logger.notice('notice message', {foo: 'bar'}); // will be logged
logger.warning('warning message', {foo: 'bar'}); // will be skipped
logger.error('error message', {foo: 'bar'}); // will be skipped
logger.critical('critical message', {foo: 'bar'}); // will be skipped

logger = Logger.getLogger('bar'); // minLevel and maxLevel will be from loggers config
logger.debug('debug message', {foo: 'bar'}); // will be skipped
logger.info('info message', {foo: 'bar'}); // will be logged
logger.notice('notice message', {foo: 'bar'}); // will be logged
logger.warning('warning message', {foo: 'bar'}); // will be skipped
logger.error('error message', {foo: 'bar'}); // will be skipped
logger.critical('critical message', {foo: 'bar'}); // will be skipped

logger = Logger.getLogger('baz'); // default config will be used
logger.debug('debug message', {foo: 'bar'}); // will be skipped
logger.info('info message', {foo: 'bar'}); // will be skipped
logger.notice('notice message', {foo: 'bar'}); // will be logged
logger.warning('warning message', {foo: 'bar'}); // will be logged
logger.error('error message', {foo: 'bar'}); // will be logged
logger.critical('critical message', {foo: 'bar'}); // will be logged
```
