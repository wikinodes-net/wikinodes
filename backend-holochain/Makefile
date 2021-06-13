# Note: you can build a target directly, eg: `nix-build -A wikinodes`

SHELL    = bash
DNA_NAME = wikinodes
DNA_DIR  = dna
DNA      = $(DNA_DIR)/$(DNA_NAME).dna
HAPP     = $(DNA_DIR)/$(DNA_NAME).happ
WASM     = target/wasm32-unknown-unknown/release/wikinodes.wasm

# External targets; Uses a nix-shell environment to obtain Holochain runtimes, run tests, etc.
.PHONY: all FORCE
all: nix-test

# eg:
# 	make nix-test
# 	make nix-build
#   ...
nix-%:
	nix-shell --pure --run "make $*"

# Internal targets; require a Nix environment in order to be deterministic.
# - Uses the version of `hc`, `holochain` on the system PATH.
# - Normally called from within a Nix environment, eg. run `nix-shell`
.PHONY:		rebuild build
rebuild:	clean build

build: $(DNA)

# Package the DNA from the built target release WASM
$(DNA):		$(WASM) FORCE
	@echo "Packaging DNA:"
	@hc dna pack $(DNA_DIR) -o $(DNA)
	@hc app pack $(DNA_DIR) -o $(HAPP)
	@ls -l $@

# Recompile the target release WASM
$(WASM): FORCE
	@echo "Building  DNA WASM:"
	@RUST_BACKTRACE=1 CARGO_TARGET_DIR=target cargo build \
		--release --target wasm32-unknown-unknown

.PHONY:		dev

dev: build
	@hc sandbox generate \
		--run 8000 \
		--app-id wikinodes \
		--root tmp \
		dna/wikinodes.happ

dev-multi: build
	@hc sandbox generate \
		--run 8000,8001 \
		--app-id wikinodes \
		--num-sandboxes 2 \
		--root tmp \
		dna/wikinodes.happ
		network \
			--bootstrap https://bootstrap-staging.holo.host \
			quic \

.PHONY: test

test: build
	cd tests && ( [ -d node_modules ] || npm install ) && npm test

test-ci: build
	cd tests && npm install && npm test

clippy: build
	cargo clippy --all-targets --all-features -- -D warnings

.PHONY: clean
clean:
	rm -rf \
		tests/node_modules \
		.cargo \
		Cargo.lock \
		target \
		$(DNA)
