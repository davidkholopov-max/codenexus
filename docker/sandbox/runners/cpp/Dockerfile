# Minimal C++ runner
FROM gcc:13-bookworm

RUN apt-get update && \
    apt-get install -y --no-install-recommends g++ make && \
    apt-get purge -y --auto-remove wget curl git && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1001 -s /bin/false runner
USER runner
WORKDIR /sandbox
