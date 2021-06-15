let
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/3e94163765975f35f7d8ec509b33c3da52661bd1.tar.gz";
    sha256 = "sha256:07sl281r29ygh54dxys1qpjvlvmnh7iv1ppf79fbki96dj9ip7d2";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
     rev = "20d2570c36b9e8da087a565a1ed644562cc92136";
     sha256 = "1bfy9q7bg929p7kzz96g4r9lhmb10v2zyywycmr3ifi1jq60rd50";
     cargoSha256 = "sha256:1gv2zhslraxiq8v5644mxb2d1sl0md6i79rsjppcf0gi7n6pd6zi";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
    holochainOtherDepsNames = ["lair-keystore"];
  };
in holonix.main
