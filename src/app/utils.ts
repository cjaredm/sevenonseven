type ClassNameArg = string | { [key: string]: boolean } | undefined;
export function classnames(...params: ClassNameArg[]): string {
  const args = [...params];
  return args
    .reduce((acc, arg) => {
      if (typeof arg === "string") {
        acc.push(arg);
      } else if (typeof arg === "object" && arg !== null) {
        Object.keys(arg).forEach((key) => {
          if (arg[key]) {
            acc.push(key);
          }
        });
      }
      return acc;
    }, [] as string[])
    .join(" ");
}
