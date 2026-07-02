# 🚀 GitLab & Git Starter Guide (Final - SSH + HTTPS)

HEllO

## 🎯 Scenario
- มี project อยู่ในเครื่องแล้ว
- GitLab repo มี README
- ใช้ได้ทั้ง SSH และ HTTPS

---

# ✅ PHASE 1: Setup Git (ครั้งแรก)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"
```

ตรวจสอบ:
```bash
git config --global --list
```

---

# ✅ PHASE 2: Setup Authentication (2 วิธี)

## ✅ วิธีที่ 1: SSH (แนะนำ ⭐)

### 1. สร้าง SSH Key
```bash
ssh-keygen -t ed25519 -C "your.email@company.com"
```

### 2. Copy key
```bash
cat ~/.ssh/id_ed25519.pub
```

### 3. เพิ่มใน GitLab
- Profile → SSH Keys → Add key

### 4. Test
```bash
ssh -T git@seagit.okla.seagate.com
```

---

## ✅ วิธีที่ 2: HTTPS

### ตั้ง credential helper
```bash
git config --global credential.helper manager
```

✔️ จะช่วยจำ username/password
✔️ ไม่ต้อง login ทุกครั้ง

---

# ✅ PHASE 3: Setup Project

```bash
cd C:/Users/your-folder/project

git init
```

---

# ✅ PHASE 4: เชื่อม GitLab

## 🔹 ใช้ SSH (แนะนำ)
```bash
git remote add origin git@seagit.okla.seagate.com:web-gallery/webgdoc.git
```

## 🔹 หรือใช้ HTTPS
```bash
git remote add origin https://seagit.okla.seagate.com/web-gallery/webgdoc.git
```

---

# ✅ PHASE 5: Sync Repo

```bash
git pull origin main --allow-unrelated-histories
```

---

# ✅ PHASE 6: Commit & Push

```bash
git add .
git commit -m "initial commit"

git branch -M main
git push -u origin main
```

หลังจากนั้น:
```bash
git push
git pull
```

---

# ✅ PHASE 7: Daily Workflow

```bash
git add .
git commit -m "update code"
git push
```

---

# ❗ ERROR ที่พบบ่อย

## 1. no upstream branch
```bash
git push -u origin main
```

## 2. SSL error (HTTPS)
```bash
git config --global http.sslverify false
```

## 3. permission denied (SSH)
- ตรวจสอบ SSH key
- เช็ค ssh -T

---

# 🎯 QUICK START

## ✅ SSH (แนะนำ)
```bash
git init
git remote add origin git@seagit.okla.seagate.com:web-gallery/webgdoc.git

git pull origin main --allow-unrelated-histories

git add .
git commit -m "init"

git branch -M main
git push -u origin main
```

## ✅ HTTPS
```bash
git init
git remote add origin https://seagit.okla.seagate.com/web-gallery/webgdoc.git

git config --global credential.helper manager

git pull origin main --allow-unrelated-histories

git add .
git commit -m "init"

git branch -M main
git push -u origin main
```

---

# ✅ DONE

- ✅ SSH = แนะนำที่สุด
- ✅ HTTPS = ใช้ได้ + มี credential helper

🚀 พร้อมใช้งาน GitLab ระดับ Production
