let
  holonixPath = builtins.fetchTarball {
    url = "https://github.com/holochain/holonix/archive/3e94163765975f35f7d8ec509b33c3da52661bd1.tar.gz";
    sha256 = "07sl281r29ygh54dxys1qpjvlvmnh7iv1ppf79fbki96dj9ip7d2";
  };
  holonix = import (holonixPath) {
    includeHolochainBinaries = true;
    holochainVersionId = "custom";

    holochainVersion = {
     rev = "8d6c4cd29bd17e8224aeffb87dc03eaf3ff33508";
     sha256 = "0ds7w342b23rgmr2kwh8qk9ccb16sflr7jd1hj1n3nkfj1m3xa52";
     cargoSha256 = "19pjrzkzkvq4rhz66dx8h41wf5swi71ycvzna0fx25i2vcpfnf35";
     bins = {
       holochain = "holochain";
       hc = "hc";
     };
    };
    holochainOtherDepsNames = ["lair-keystore"];
  };
in holonix.main
