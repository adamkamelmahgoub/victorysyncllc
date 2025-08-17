
export function getToken(): string | null {
  return localStorage.getItem("vs_token");
}

export function setToken(t: string) {
  localStorage.setItem("vs_token", t);
}
