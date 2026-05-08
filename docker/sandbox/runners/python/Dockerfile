# Minimal Python runner — no network, read-only FS
FROM python:3.12-slim

# Security: remove unnecessary tools if present
RUN apt-get purge -y --auto-remove wget curl git 2>/dev/null || true && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1001 -s /bin/false runner

# Install common educational packages only
RUN pip install --no-cache-dir \
    requests==2.31.0 \
    numpy==1.26.0 \
    && rm -rf /root/.cache/pip

# Drop to non-root
USER runner
WORKDIR /sandbox

# No entrypoint — command is passed by the Go runner
