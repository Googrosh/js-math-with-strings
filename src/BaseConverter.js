// @flow

export default class BaseConverter {

  static _isNegativeValueAllowed (base) {
    return Array.isArray(base) && !base.includes('-')
  }

  static convert (value, fromBase, toBase) {
    return this.encode(this.decode(value, fromBase), toBase)
  }

  /**
   * @function encode
   * @desc encodes a decimal number into a selected base
   * @param { string } num - deciaml number as string
   * @param { Array<string> } base - symbols array of the output base
   * @returns number as string in the selected base
   * @author Andrea d'Argenio <a.dargenio90@gmail.com>
   */
  static encode = (num, base) => {
    if (
      typeof num !== 'string' ||
      num === null ||
      !Array.isArray(base) ||
      !base.length
    ) {
      return null
    }
  
    let value = num.startsWith('-')
      ? num.slice(1)
      : num
  
    const encoded = []
    const count = base.length
  
    if (count === 1 && num !== '0') {
      return null
    }
  
    while (Number(value) >= count) {
      const i = Number(stringModule(value, count.toString()))
      value = stringDivision(
        stringSubtraction(value, i.toString()),
        count.toString()
      )
      encoded.push(base[i])
    }
  
    encoded.push(base[Number(value)])
  
    return encoded.reverse().join('')
  }
  
  /**
   * @function decode
   * @desc decodes a number with a specific base into a decimal number
   * @param { string } value - number as string
   * @param { Array<string> } base - symbols array of the input base
   * @returns decimal number as string
   * @author Andrea d'Argenio <a.dargenio90@gmail.com>
   */
  static decode = (value, base) => {
    if (value === '' || !Array.isArray(base) || !base.length) {
      return null
    }
    const count = base.length
    const hash = base.reduce((hash, num, i) => {
      hash[num] = i
      return hash
    }, {})
  
    let number = '0'
    let str = String(value)
  
    let pow = 0
    while (str.length > 0) {
      const chr = str[str.length - 1]
      const num = String(hash[chr])
  
      if (typeof num !== 'string') {
        return null
      }
  
      str = str.slice(0, -1)
      let foo = '1'
      for (let i = 0; i < pow; i++) {
        foo = stringMultiplication(foo, count.toString())
      }
  
      number = stringAddition(number, stringMultiplication(foo, num))
      pow++
    }
  
    return number
  }
  
  /**
   * @function stringAddition
   * @desc sums two numbers as string
   * @param { string } a - first number as string
   * @param { string } b - second number as string
   * @returns result of the addition
   * @author Andrea d'Argenio <a.dargenio90@gmail.com>
   */
  static stringAddition = (a, b) => {
    if (typeof a !== 'string' && typeof b !== 'string') {
      return null
    }
  
    let result = ''
    let rest = 0
  
    for (let i = a.length, j = b.length; i > 0 || j > 0; i--, j--) {
      const a1 = a[i - 1] || '0'
      const a2 = b[j - 1] || '0'
  
      let r = `${Number(a1) + Number(a2) + rest}`
      rest = 0
      if (r.length > 1) {
        rest = Number(r[0])
        r = r[1]
      }
      result = r + result
    }
  
    if (rest) {
      result = `${rest}${result}`
    }
  
    return result
  }
  
  /**
   * @function stringSubtraction
   * @desc subtracts the second number as string with the first one as string
   * @param { string } a - first number as string
   * @param { string } b - second number as string
   * @returns result of the subtraction
   * @author Andrea d'Argenio <a.dargenio90@gmail.com>
   */
  static stringSubtraction = (a, b) => {
    if (typeof a !== 'string' && typeof b !== 'string') {
      return null
    }
  
    let result = ''
    let A = a
    const B = b
  
    for (let i = A.length, j = B.length; i > 0 || j > 0; i--, j--) {
      const a1 = A[i - 1] || '0'
      const a2 = B[j - 1] || '0'
  
      let r = Number(a1) - Number(a2)
  
      if (r < 0) {
        let k = i - 1
        let finished = false
        do {
          k--
          if (Number(A[k]) > 0) {
            A = A.slice(0, k) + `${Number(A[k]) - 1}` + A.slice(k + 1)
            finished = true
          }
        } while (!finished)
  
        for (let y = k + 1; y < i - 1; y++) {
          A = A.slice(0, y) + `${Number(A[y]) + 9}` + A.slice(y + 1)
        }
  
        r += 10
      }
  
      result = r + result
    }
  
    return result.replace(/^0*/, '')
  }
  
  /**
   * @function stringMultiplication
   * @desc multiplies two numbers as string
   * @param { string } a - first number as string
   * @param { string } b - second number as string
   * @returns result of the multiplication
   * @author Andrea d'Argenio <a.dargenio90@gmail.com>
   */
  static stringMultiplication = (a, b) => {
    if (typeof a !== 'string' && typeof b !== 'string') {
      return null
    }
  
    let pow = Number(b)
    let foo = b
  
    let result = '0'
    while (pow > 0) {
      result = stringAddition(result, a)
  
      foo = stringSubtraction(foo, '1')
      pow = Number(foo)
    }
  
    return result
  }
  
  /**
   * @function stringDivision
   * @desc divides the first number as string with the second one as string
   * @param { string } a - first number as string
   * @param { string } b - second number as string
   * @returns result of the division
   * @author Andrea d'Argenio <a.dargenio90@gmail.com>
   */
  static stringDivision = (a, b) => {
    if (typeof a !== 'string' && typeof b !== 'string') {
      return null
    }
  
    let result = ''
    let rest = 0
    let r
  
    for (let i = 0; i < a.length; i++) {
      rest *= 10
      rest += Number(a[i])
  
      r = Math.floor(rest / Number(b))
      if (r > 0) {
        rest = rest % Number(b)
      }
  
      result += r.toString()
    }
  
    return result.replace(/^0*/, '')
  }
  
  /**
   * @function stringModule
   * @desc divides the first number as string with the second one as string and
   * gives the remainder of the division
   * @param { string } a - first number as string
   * @param { string } b - second number as string
   * @returns remainder of the division
   * @author Andrea d'Argenio <a.dargenio90@gmail.com>
   */
  static stringModule = (a, b) => {
    if (typeof a !== 'string' && typeof b !== 'string') {
      return null
    }
  
    let rest = 0
  
    for (let i = 0; i < a.length; i++) {
      rest *= 10
      rest += Number(a[i])
  
      if (rest >= Number(b)) {
        rest = rest % Number(b)
      }
    }
  
    return rest
  }
}
