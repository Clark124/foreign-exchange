import axios from 'axios'
 
import Service from './server'
// import TICK_SIZE from './ticks';
import moment from 'moment'
export function post(url, data, isformData = false) {
    return new Promise((resolve, reject) => {
        // let header = isformData ? null : { 'Content-type': 'application/json' };
        axios.post(url, data
        ).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err);
        })
    })
}

export function deleteData(url, data, isformData = false) {
    return new Promise((resolve, reject) => {
        // let header = isformData ? null : { 'Content-type': 'application/json' };
        axios.delete(url, data
        ).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err);
        })
    })
}

export function putData(url, data, isformData = false) {
    return new Promise((resolve, reject) => {
        axios.put(url, data
        ).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err);
        })
    })
}


export function postData(url, data) {
    return new Promise((resolve, reject) => {
        axios({
            url, data,
            method: 'post',
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err);
        })
    })
}

export function get(url, data) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: data }, {
        }).then(res => {
            // console.log(url,data)
            // console.log(res)
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

export const getAddToken = (url, data, token) => {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: data, headers: { 'token': token } }).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }


/*k线数据格式化成图形需要的格式*/
export function changeNumber(Array, tickSize) {
    let arr = []

    Array.forEach((item) => {
        let date = ""
        if (item[0].toString().length === 8) {
            date = new Date(moment(item[0].toString(), 'YYYYMMDD').format('YYYY-MM-DD'))
        } else if (item[0].toString().length === 12) {
            date = new Date(moment(item[0].toString(), 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm'))
        }
        arr.push({
            close: +(item[4]).toFixed(tickSize),
            high: +(item[2]).toFixed(tickSize),
            low: +(item[3]).toFixed(tickSize),
            open: +(item[1]).toFixed(tickSize),
            date: date,
            volume: item[5]
        })

    })
    return arr
}

/*字符带/请求*/
export function tick_code(name) {
    return new Promise((resolve, reject) => {
        post(Service.host + Service.realSymbols, {}).then((data) => {
            // console.log(data)
            localStorage.setItem('realSymbols', JSON.stringify(data.data))
            resolve(data.data)
        })
    })
}

/*获取字符保留位数的长度*/
export function tick_size(name) {
    return new Promise((resolve, reject) => {
        post(Service.host + Service.realPrecise, {}).then((data) => {
            // console.log(data)
            localStorage.setItem('TICK_SIZE', JSON.stringify(data))
            resolve(data)
        })
    })
}

/*获取字符交易数量最低数量*/
export function realQuantity(name) {
    return new Promise((resolve, reject) => {
        post(Service.host + Service.realQuantityIncrement, {}).then((data) => {
            // console.log(data)
            localStorage.setItem('realQuantity', JSON.stringify(data))
            resolve(data)
        })
    })
}
/*清除字符串空格*/
export function trim(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase === "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

//缓存自选股
export function optional() {
    return new Promise((resolve, reject) => {
        post(Service.host + Service.marketFavoriteList, { user_id: localStorage.getItem('user_id') }).then((data) => {
            localStorage.setItem('optional', JSON.stringify(data.data))
            resolve(data)
        })
    })

}

//获取url后面的参数
export function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//加密url
export function getEncodeString(srcString) {
    //var srcString = 'abc';

    var index = 0;
    var digit = 0;
    var currByte;
    var nextByte;
    var retrunString = '';
    var BASE32CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

    for (var i = 0; i < srcString.length;) {
        //var          index    = 0;
        currByte = (srcString.charCodeAt(i) >= 0) ? srcString.charCodeAt(i)
            : (srcString.charCodeAt(i) + 256);

        if (index > 3) {
            if ((i + 1) < srcString.length) {
                nextByte = (srcString.charCodeAt(i + 1) >= 0)
                    ? srcString.charCodeAt(i + 1)
                    : (srcString.charCodeAt(i + 1) + 256);
            } else {
                nextByte = 0;
            }

            digit = currByte & (0xFF >> index);
            index = (index + 5) % 8;
            digit <<= index;
            digit |= (nextByte >> (8 - index));
            i++;
        } else {
            digit = (currByte >> (8 - (index + 5))) & 0x1F;
            index = (index + 5) % 8;

            if (index === 0) {
                i++;
            }
        }

        retrunString = retrunString + BASE32CHAR.charAt(digit);
    }
    return retrunString.toLowerCase();
}
//解密url参数
export function getDecodeString(encodeString) {
    var i;
    var index;
    var lookup;
    var offset;
    var digit;
    // var base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var BASE32LOOOKUP = [0xFF, 0xFF, 0x1A, 0x1B, 0x1C,
        0x1D, 0x1E, 0x1F, // '0', '1', '2', '3', '4', '5', '6', '7'
        0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // '8', '9', ':',
        // ';', '<', '=',
        // '>', '?'
        0xFF, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, // '@', 'A', 'B',
        // 'C', 'D', 'E',
        // 'F', 'G'
        0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, // 'H', 'I', 'J',
        // 'K', 'L', 'M',
        // 'N', 'O'
        0x0F, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, // 'P', 'Q', 'R',
        // 'S', 'T', 'U',
        // 'V', 'W'
        0x17, 0x18, 0x19, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // 'X', 'Y', 'Z',
        // '[', '', ']',
        // '^', '_'
        0xFF, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, // '`', 'a', 'b',
        // 'c', 'd', 'e',
        // 'f', 'g'
        0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, // 'h', 'i', 'j',
        // 'k', 'l', 'm',
        // 'n', 'o'
        0x0F, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, // 'p', 'q', 'r',
        // 's', 't', 'u',
        // 'v', 'w'
        0x17, 0x18, 0x19, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, // 'x', 'y', 'z',
        // '{', '|', '}',
        // '~', 'DEL'
    ]

    encodeString = encodeString.toUpperCase();
    var stringLen = parseInt((encodeString.length * 5) / 8);
    var bytes = new Array(stringLen);
    for (var a = 0; a < stringLen; a++) {
        bytes[a] = 0;
    }

    for (i = 0, index = 0, offset = 0; i < encodeString.length; i++) {
        var charCode0 = '0'.charCodeAt(0);
        lookup = encodeString.charCodeAt(i) - charCode0;

        if ((lookup < 0) || (lookup >= BASE32LOOOKUP.length)) {
            continue;
        }

        digit = BASE32LOOOKUP[lookup];

        if (digit === 0xFF) {
            continue;
        }

        if (index <= 3) {
            index = (index + 5) % 8;

            if (index === 0) {
                bytes[offset] = bytes[offset] | digit;

                offset++;

                if (offset >= bytes.length) {
                    break;
                }
            } else {
                bytes[offset] = bytes[offset] | (digit << (8 - index));

            }
        } else {
            index = (index + 5) % 8;
            bytes[offset] = bytes[offset] | (digit >>> index);

            offset++;

            if (offset >= bytes.length) {
                break;
            }

            bytes[offset] = bytes[offset] | (digit << (8 - index));
            if (bytes[offset] >= 256) {

                //var lp = parseInt(bytes[offset]/256);

                bytes[offset] %= 256;
            }
        }
    }

    //return bytes.join(',');
    var realkeyString = '';
    // var decodeString = '';
    for (let a = 0; a < bytes.length; a++) {

        var realkey = String.fromCharCode(bytes[a]);
        realkeyString += realkey;
        //decodeString += bytes[a];

    }
    return realkeyString;

}

export let log = console.log.bind(console);