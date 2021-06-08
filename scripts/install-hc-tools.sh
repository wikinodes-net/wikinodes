#!/bin/bash
set -euxo pipefail

HOLOCHAIN_GITHUB=https://github.com/holochain/holochain.git
REV=8d6c4cd29bd17e8224aeffb87dc03eaf3ff33508

cargo install holochain_cli \
  --git $HOLOCHAIN_GITHUB \
  --rev $REV

cargo install \
  --git https://github.com/holochain/lair.git \
  --rev 3bd7105108ab241d6719e200dd15905cd3e74da1
