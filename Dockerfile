# syntax=docker/dockerfile:1
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive \
    RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    BUN_INSTALL=/usr/local \
    PATH=/usr/local/cargo/bin:/usr/local/bin:${PATH}

ARG USERNAME=developer
ARG USER_UID=1000
ARG USER_GID=1000

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    wget \
    file \
    unzip \
    locales \
    xauth \
    dbus-x11 \
    xvfb \
    libgdk-pixbuf-2.0-0 \
    libgtk-3-0 \
    libgtk-3-dev \
    libwebkit2gtk-4.1-dev \
    libx11-dev \
    libx11-xcb1 \
    libxdo-dev \
    libxcb1 \
    libxcb-render0 \
    libxcb-shm0 \
    libxext6 \
    libxi6 \
    libxrandr2 \
    libxss1 \
    libssl-dev \
    libudev-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    ca-certificates \
    xvfb \
    git \
    procps \
 && locale-gen en_US.UTF-8 \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8 \
    NO_AT_BRIDGE=1

# Bun (Frontend)
RUN curl -fsSL https://bun.sh/install | bash
# Rust (Backend)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

RUN set -eux; \
    existing_group="$(getent group | awk -F: -v gid=${USER_GID} '$3 == gid {print $1}')" || true; \
    if [ -z "${existing_group:-}" ]; then \
      groupadd --gid "${USER_GID}" "${USERNAME}"; \
    elif [ "${existing_group}" != "${USERNAME}" ]; then \
      groupmod --new-name "${USERNAME}" "${existing_group}"; \
    fi; \
    existing_user="$(getent passwd | awk -F: -v uid=${USER_UID} '$3 == uid {print $1}')" || true; \
    if id -u "${USERNAME}" >/dev/null 2>&1; then \
      usermod --gid "${USER_GID}" --home "/home/${USERNAME}" --shell /bin/bash "${USERNAME}"; \
    elif [ -n "${existing_user:-}" ]; then \
      usermod --login "${USERNAME}" --home "/home/${USERNAME}" --move-home --shell /bin/bash "${existing_user}"; \
      usermod --gid "${USER_GID}" "${USERNAME}"; \
    else \
      useradd --uid "${USER_UID}" --gid "${USER_GID}" --create-home --shell /bin/bash "${USERNAME}"; \
    fi; \
    mkdir -p "${RUSTUP_HOME}" "${CARGO_HOME}" /workspace/PaperLens \
    && chown -R "${USERNAME}:${USER_GID}" "${RUSTUP_HOME}" "${CARGO_HOME}" /workspace/PaperLens

USER ${USERNAME}
WORKDIR /workspace/PaperLens

# COPY --chown=${USER_UID}:${USER_GID} package.json bun.lock ./
# RUN bun install --frozen-lockfile

# COPY --chown=${USER_UID}:${USER_GID} src-tauri/Cargo.toml src-tauri/Cargo.lock ./src-tauri/
# RUN mkdir -p src-tauri/src \
 # && [ -f src-tauri/src/lib.rs ] || echo "// stub lib for cargo fetch cache" > src-tauri/src/lib.rs \
 # && [ -f src-tauri/src/main.rs ] || echo "fn main() {}" > src-tauri/src/main.rs
# RUN cd src-tauri && cargo fetch

EXPOSE 1420

CMD ["xvfb-run", "--auto-servernum", "bun", "tauri", "dev"]