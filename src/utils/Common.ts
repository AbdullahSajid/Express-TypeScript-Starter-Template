import { urlAlphabet } from 'nanoid'
import { customAlphabet } from 'nanoid/non-secure'
import { validationResult } from 'express-validator'
import { ErrorHandler } from '../types/Common'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../constants/DefaultConstants'

// common functions
export const capitalize = (str: string) => {
  str = str.trim()
  str = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
  return str
}

export const capitalizeEachWord = (str: string) => {
  const words = str.trim().split(' ')
  words.forEach((word, index) => {
    words[index] = word[0].toUpperCase() + word.slice(1)
  })
  return words.join(' ')
}

export const pluralize = (word: string, count: number) => {
  return count + ' ' + word + (count > 1 ? 's' : '')
}

export const roundUptoTwoDecimals = (num: string) => {
  const number = parseFloat(num)
  if (isNaN(number)) throw new ErrorHandler(400, "Value is not a number")
  return Math.round(number * 100) / 100
}

export const getLanguage = (lang: string) => {
  if (LANGUAGES.includes(lang)) return lang
  return DEFAULT_LANGUAGE
}

export const getCustomSizeNanoId = (size: number) => {
  const nanoid = customAlphabet(urlAlphabet, size)
  return nanoid()
}

export const getAlphaNumericNanoId = (size: number) => {
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', size)
  return nanoid()
}

export const getNumericNanoId = (size: number) => {
  const nanoid = customAlphabet('0123456789', size)
  return nanoid()
}

export const getTimestampBasedUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export const getUniqueId = (size: number) => {
  if (size < 6) throw new ErrorHandler(400, 'Size must be greater than or equal to 6')
  const date = new Date()
  const year = date.getFullYear().toString().slice(2)
  let month = (date.getMonth() + 1).toString()
  month = month.padStart(2, '0')
  return year + month + getNumericNanoId(size - 4)
}

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const errorFormatter = (error: any) => {
  return {
    param: error.param,
    msg: error.msg || `${error.param} is invalid`
  }
}

export const validate = async (req: any, validations: any) => {
  for (const validation of validations) {
    const result = await validation.run(req)
    if (result.errors.length) break
  }
  const errors = validationResult(req).formatWith(errorFormatter)
  if (!errors.isEmpty()) {
    throw new ErrorHandler(400, 'Validation Error', errors.array({ onlyFirstError: true }))
  }
}

export const returnError = (statusCode: number, errorMessage: string) => {
  const error: any = new Error(errorMessage)
  error.statusCode = statusCode || 400
  return error
}
