# Ralph Testing Walkthrough

## ✅ Antigravity Setup

Ralph runs natively on the Antigravity Engine. No additional installation is required.

---

## 🧪 Test Scenarios

### Test 1: Verify Engine

**Command:**
```bash
gemini --version
```
**Success:** Prints version number (e.g., 0.24.4)

### Test 2: The "Antigravity" Check

Verify Ralph detects the engine correctly.

**Command:**
```bash
./ralphy.sh --help | grep "Default"
```

**Expected Output:**
```
  --antigravity       Use Antigravity AI with memory bank (default)
```

### Test 3: Safe Dry Run

**Command:**
```bash
./ralphy.sh --dry-run
```
**Expected Output:**
```
[DRY RUN] AI Engine: antigravity
[DRY RUN] Task Source: memory-bank/TASKS.md
```
*Note: If this fails, ensure you are running within the Antigravity environment.*

---

### Test 3: Single Task Mode (Recommended First Test)

This is the safest way to test - runs just ONE task:

**Step 1: Run a simple task**
```bash
./ralphy.sh "create a README.md file with project description" --dry-run
```

**Step 2: Run it for real (without dry-run)**
```bash
./ralphy.sh "add a comment to the top of ralphy.sh saying 'tested on $(date)'"
```

**Expected Behavior:**
1. Engine starts
2. Task is executed
3. Changes are committed automatically
4. Success message displayed

---

### Test 4: TASKS.md Processing

**Step 1: View current TASKS.md**
```bash
cat memory-bank/TASKS.md | head -50
```

**Step 2: Count pending tasks**
```bash
grep -c '\[ \]' memory-bank/TASKS.md
```

**Step 3: Run Ralph on TASKS.md (sequential for safety)**
```bash
./ralphy.sh --no-parallel --max-iterations 1
```

This runs only ONE iteration and processes ONE task.

**Step 4: Verify task was marked complete**
```bash
git diff memory-bank/TASKS.md
```

---

### Test 5: Alternative Engines

If you want to use other engines:

**OpenCode:**
```bash
./ralphy.sh --opencode "create a test file"
```

**Cursor:**
```bash
./ralphy.sh --cursor "add logging to main function"
```

---

### Test 6: Branch Per Task Workflow

Test the feature branch workflow:

```bash
./ralphy.sh --branch-per-task --no-parallel --max-iterations 1 "add footer component"
```

**Expected:**
1. Creates branch `ralphy/add-footer-component`
2. Executes task
3. Commits on that branch
4. Returns to original branch

---

### Test 7: Configuration

**Initialize config:**
```bash
./ralphy.sh --init
```

**View config:**
```bash
./ralphy.sh --config
```

**Add a rule:**
```bash
./ralphy.sh --add-rule "Always use TypeScript strict mode"
./ralphy.sh --config
```

---

## Quick Test Script

Save this as `test-ralph.sh` and run it:

```bash
#!/bin/bash
set -e

echo "=== Ralph Test Suite ==="
echo ""

echo "1. Testing --help..."
./ralphy.sh --help | head -5
echo "✅ Help works"
echo ""

echo "2. Testing --version..."
./ralphy.sh --version
echo "✅ Version works"
echo ""

echo "3. Testing --dry-run..."
./ralphy.sh --dry-run 2>&1 | head -5 || echo "⚠️ Dry run failed"
echo ""

echo "4. Checking TASKS.md..."
if [[ -f "memory-bank/TASKS.md" ]]; then
  pending=$(grep -c '\[ \]' memory-bank/TASKS.md 2>/dev/null || echo "0")
  echo "✅ Found $pending pending tasks"
else
  echo "⚠️ No TASKS.md found"
fi
echo ""

echo "5. Testing syntax..."
bash -n ralphy.sh && echo "✅ Syntax OK" || echo "❌ Syntax Error"
echo ""

echo "=== All tests complete ==="
```

---

## Troubleshooting

### "Antigravity Engine not found"

Ensure you are running this script within the Antigravity IDE environment which provides the native engine.

### "TASKS.md not found"

```bash
# Create it
mkdir -p memory-bank
cat > memory-bank/TASKS.md << 'EOF'
# Test Tasks

## Phase 1
- [ ] Create a hello world function
- [ ] Add unit tests

## Phase 2
- [ ] Add documentation
EOF
```

### "Permission denied"

```bash
chmod +x ralphy.sh
```

### "Not a git repository"

```bash
git init
git add .
git commit -m "Initial commit"
```
