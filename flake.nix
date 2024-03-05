{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    { systems
    , nixpkgs
    , ...
    } @ inputs:
    let
      eachSystem = f:
        nixpkgs.lib.genAttrs (import systems) (
          system:
          f nixpkgs.legacyPackages.${system}
        );
    in
    {
      devShells = eachSystem (pkgs: {
        default = pkgs.mkShell {
          buildInputs = let
            postgresql_15 = pkgs.postgresql_15.withPackages (pkgs: [ pkgs.pgroonga ]);
          in with pkgs; [
            dbmate
            dprint
            nodejs_21
            overmind
            pgformatter
            postgresql_15
            redis
          ];

          shellHook = ''
            export PGDATA=$PWD/pgdata
            export DATABASE_URL=postgres://localhost/meikyu_dev?sslmode=disable
            export REDIS_URL=redis://localhost

            export DBMATE_MIGRATIONS_DIR="./migrations"
            export DBMATE_SCHEMA_FILE="./schema.sql"
            export DBMATE_STRICT

            initdb &> /dev/null
          '';
        };
      });
    };
}
