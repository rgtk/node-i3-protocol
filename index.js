module.exports.encode = function encode(type, message) {
  if(type == null) {
    throw new Error('Type cannot be empty');
  }
  if(type > 7 || type < 0) {
    throw new Error('Unknown type ' + type);
  }
  message = message || '';
  var len = message.length;
  var b = new Buffer(14 + len);
  b.write('i3-ipc');
  b.writeUInt32LE(len, 6);
  b.writeUInt32LE(type, 10);
  b.write(message, 14);
  return b;
};

exports.decode = function decode(buffer) {
  if(buffer.slice(0, 6).toString() !== 'i3-ipc') {
    throw new Error('`i3-ipc` prefix missing form the buffer');
  }
  var len = buffer.readUInt32LE(6);
  if(len !== buffer.length-14) {
    throw new Error('Buffer has wrong length');
  }
  var type = buffer.readUInt32LE(10);
  if(type > 7) {
    throw new Error('Buffer has wrong type');
  }
  if(len == 0) {
    return { type: type };
  }
  return {
    type: type,
    message: JSON.parse(buffer.slice(14).toString())
  };
};
