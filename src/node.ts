import { List, Any, Boolean, I } from 'ts-toolbelt'
import 'reflect-metadata'

type ValidStatusCodes = [100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 300, 301, 302, 303, 304, 305, 306, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 422, 423, 424, 426, 428, 429, 431, 450, 451, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 509, 510, 511, 522, 525]
export type Response<C,R> = List.Includes<ValidStatusCodes, C, 'equals'> extends 1 ? [C, R] : never

type IsResponse<X> = X extends [infer C, infer R] ? List.Includes<ValidStatusCodes, C, 'equals'> extends 1 ? 1: 0 : 0

type Handler<Rs extends any[]> = {
  0: List.Head<Rs> | Handler<List.Tail<Rs>>
  1: never
}[List.Length<Rs> extends 0 ? 1 : IsResponse<List.Head<Rs>> extends 1 ? List.Head<Rs> extends never ? 1 : 0 : 1]


type Capture<T, n> = Any.IsLiteral<n, string> extends 1 ? [T, n] : never
type Body<T> = [T, null]
type _Flatten<Ns extends any[]> = {
  0: Any.IsLiteral<List.Head<Ns>, string> extends 1
  ? _Flatten<List.Tail<Ns>>
  : (
    List.Head<Ns> extends Capture<infer T, infer _n>
      ? (t: T) => _Flatten<List.Tail<Ns>>
      : (
        List.Head<Ns> extends Body<infer T>
        ? (t: T) => _Flatten<List.Tail<Ns>>
        : (
          List.Head<Ns> extends Handler<infer _Rs>
          ? List.Head<Ns>
          : never
        )
      )
  )
  1: never
}[List.Length<Ns> extends 0 ? 1 : 0]
// type Endpoint<Ns extends any[]> = 

interface User {
  id: number
  name: string
}

type TestEndpoint = Endpoint<["users", Capture<number, "id">, Handler<[Response<200, User>, Response<404, string>]>]>

type test = [1,2,3]
type test2 = List.UnionOf<test>

function exampleHandler(input: boolean): Handler<[Response<200, string>, Response<404, { error: string }>]> {
  if(input) {
    const x: Response<200, string> = [200, 'Yes! We did it'];
    return x;
  } else {
    return [404, { error: 'Not found' }]
  }
}


// TODO: safe endpoint paths, i.e. [Node<"users">, Capture<int, "id">, Handler<[Response<200, User>, Response<404, string>]>] or something.

