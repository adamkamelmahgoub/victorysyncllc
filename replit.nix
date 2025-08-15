
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.git
    pkgs.wget
    pkgs.curl
    pkgs.rsync
    pkgs.ripgrep
    pkgs.findutils
    pkgs.coreutils
  ];
}
