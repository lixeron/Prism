.PHONY: setup dev test lint format docker-up docker-down clean

# ── Setup ──────────────────────────────────────────────
setup:
	python -m venv .venv
	.venv/bin/pip install -r requirements.txt
	cp -n .env.example .env 2>/dev/null || true
	@echo "✓ Setup complete. Activate with: source .venv/bin/activate"

# ── Development ────────────────────────────────────────
dev:
	uvicorn app.main:app --reload --port 8000

# ── Testing ────────────────────────────────────────────
test:
	pytest tests/ -v

test-cov:
	pytest tests/ -v --cov=app --cov-report=term-missing

# ── Code Quality ───────────────────────────────────────
lint:
	ruff check app/ tests/

format:
	ruff format app/ tests/

# ── Docker ─────────────────────────────────────────────
docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

# ── Cleanup ────────────────────────────────────────────
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	rm -rf .pytest_cache .ruff_cache
