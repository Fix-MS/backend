{
  description = "Backend fixms";

  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:nixos/nixpkgs";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let pkgs = nixpkgs.legacyPackages.${system}; in
        {
          defaultPackage =
            with import nixpkgs { system = "x86_64-linux"; };
      stdenv.mkDerivation {
        name = "itpms-site";
        src = ./.;
        buildPhase = ''
          ln -s ${(pkgs.callPackage ./default.nix {}).shell.nodeDependencies}/lib/node_modules ./node_modules
          export PATH="${(pkgs.callPackage ./default.nix {}).shell.nodeDependencies}/bin:$PATH"
        '';
        buildInputs = [
            nodejs-14_x
            node2nix
            python310Full
            (callPackage ./default.nix {}).shell.nodeDependencies
        ];
        shellHook = ''
          ln -s ${(pkgs.callPackage ./default.nix {}).shell.nodeDependencies}/lib/node_modules ./node_modules
          export PATH="${(pkgs.callPackage ./default.nix {}).shell.nodeDependencies}/bin:$PATH"
        '';
        installPhase = ''
          mkdir -p $out
          mkdir $out/bin
          echo "npm run start" > $out/bin/start
          chmod +x $out/bin/start
          cp -r node_modules $out/node_modules
          cp package.json $out/
          cp -r src $out/src
          '';
      };
    });
}
