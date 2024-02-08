type ComputeRange<N extends number,
  Result extends Array<unknown> = [],
  > =
  (Result['length'] extends N
    ? Result
    : ComputeRange<N, [...Result, Result['length']]>
    )

const ComputeRange = (N: number, Result: number[] = []): number[] => {
  if (Result.length === N) {
    return Result
  }
  return ComputeRange(N, [...Result, Result.length])
}

type PrependNextNum<A extends Array<unknown>> = A["length"] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A["length"] ? 0 : 1];

type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[]
  ? E
  : never;

export type {
  ComputeRange,
  Enumerate
}
