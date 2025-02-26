import { kebabCase } from 'es-toolkit';

export const trackEvent = (name, properties) => {
  try {
    if (typeof FS === 'undefined') {
      return;
    }
    FS('trackEvent', { name, properties });
  } catch (e) {
    console.log('error tracking FullStory event', e);
  }
};

/**
 * Helper function to simplify setting Fullstory tracking attributes for an Element
 * @param {string} name Unique name for this element in Fullstory
 * @param {Object.<string, string | boolean | number | Date>} properties Object defining specific Element properties
 * @returns {Object}
 * @example
 *   const trackingAttrs = buildTrackingAttrs('Some Button', {
 *     size: 23 ,
 *     owner: 'Bob',
 *     isCool: false,
 *   })
 *
 *   // spread onto element to be tracked
 *   <Button {...trackingAttrs}>Sign Up</Button>
 */
export const buildTrackingAttrs = (name, properties) => {
  if (!properties) {
    return {
      'data-fs-element': name,
    };
  }

  const attributes = {};
  const propSchema = {};

  Object.entries(properties).forEach(([key, initialValue]) => {
    const prefixedKey = `data-${kebabCase(key)}`;
    let value = initialValue;
    let propType;

    switch (typeof initialValue) {
      case 'string':
        propType = 'str';
        break;
      case 'boolean':
        propType = 'bool';
        break;
      case 'number':
        propType = Number.isInteger(value) ? 'int' : 'real';
        break;
      case 'object':
        if (initialValue instanceof Date) {
          propType = 'date';
          value = initialValue.toISOString();
          break;
        }
      default:
        // ignore property if not one of the above types
        return;
    }

    attributes[prefixedKey] = value;
    propSchema[prefixedKey] = propType;
  });

  return {
    'data-fs-element': name,
    'data-fs-properties-schema': JSON.stringify(propSchema),
    ...attributes,
  };
};
