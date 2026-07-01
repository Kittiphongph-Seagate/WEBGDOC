import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  FolderGit2,
  GitBranch,
  ArrowRightLeft,
  Settings,
  HardDrive,
  Code,
  Laptop,
  Database,
  Sparkles,
  Info,
  Server,
  FileCode,
  FolderOpen,
  Cpu,
  Bookmark,
  X
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CATEGORIES_CONFIG = [
  { name: "1. การตั้งค่า (Configuration)", icon: Settings, label: "Configuration" },
  { name: "2. เริ่มโปรเจกต์ (Starting a Project)", icon: FolderGit2, label: "Starting Project" },
  { name: "3. การทำงานประจำวัน (Day-to-Day)", icon: Laptop, label: "Day-to-Day" },
  { name: "4. สาขาการทำงาน (Branching)", icon: GitBranch, label: "Branching" },
  { name: "5. รีโมทเซิร์ฟเวอร์ (Remote)", icon: Server, label: "Remote" },
  { name: "6. การเก็บงานชั่วคราว (Storing)", icon: Database, label: "Storing" },
  { name: "7. ป้ายกำกับ (Tagging)", icon: Bookmark, label: "Tagging" }
];

const COMMANDS = {
  config: {
    id: "config",
    category: "1. การตั้งค่า (Configuration)",
    title: "git config (Identity)",
    icon: Settings,
    subtitle: "กำหนดตัวตนผู้ใช้งานระบบ Git",
    command: (params) => `git config --global user.name "${params.name}"\ngit config --global user.email "${params.email}"`,
    description: "ขั้นตอนแรกของการระบุตัวตนในการบันทึกประวัติ (Commit) ในระบบ GitLab เพื่อแสดงรูปและอีเมลอย่างถูกต้องบนฐานข้อมูลประวัติ",
    parameters: [
      { key: "name", label: "ชื่อผู้ใช้ (user.name)", type: "text", defaultValue: "Somchai Dev" },
      { key: "email", label: "อีเมลติดต่อ (user.email)", type: "text", defaultValue: "somchai@company.com" }
    ],
    explanation: [
      "ธง --global จะบันทึกข้อมูลมีผลกับทุกโฟลเดอร์ในเครื่องปัจจุบัน",
      "user.name ระบุชื่อเพื่อแสดงตัวตนบนประวัติงาน",
      "user.email ระบุอีเมลสำหรับเชื่อมระบบบัญชีภาพโปรไฟล์บนคลาวด์"
    ],
    successOutput: (params) => `# ข้อมูลตัวตนถูกระบุลงในระบบเรียบร้อย\n# user.name: "${params.name}"\n# user.email: "${params.email}"`
  },
  color_ui: {
    id: "color_ui",
    category: "1. การตั้งค่า (Configuration)",
    title: "git config (Color UI)",
    icon: Cpu,
    subtitle: "เปิดใช้สีข้อความใน Terminal คอนโซล",
    command: () => "git config --global color.ui auto",
    description: "ตั้งค่าแสดงผลสีสัน (Colorized terminal output) ให้กับข้อความตอบกลับของ Git CLI เพื่อช่วยให้อ่านข้อมูลประวัติและการรายงานผลลัพธ์ต่าง ๆ ได้ง่ายและชัดเจนขึ้น",
    parameters: [],
    explanation: [
      "color.ui auto จะช่วยระบุสถานะไฟล์สีแดงและสีเขียวอย่างชัดเจน",
      "ช่วยลดความผิดพลาดในการอ่านผลลัพธ์คำสั่งเช็คไฟล์",
      "มีผลกับหน้าต่าง Terminal คอนโซลของทุกโปรเจกต์ในระบบคอมพิวเตอร์"
    ],
    successOutput: () => `# เปิดใช้งานสีสันข้อความ Git สำเร็จ!\n# color.ui = auto`
  },
  init: {
    id: "init",
    category: "2. เริ่มโปรเจกต์ (Starting a Project)",
    title: "git init",
    icon: FolderGit2,
    subtitle: "สร้างคลังจัดเก็บประวัติเวอร์ชันในเครื่อง",
    command: (params) => `git init ${params.project}`,
    description: "สร้างฐานข้อมูลหรือโฟลเดอร์ระบบ Git ซ่อนอยู่ (.git) ในโปรเจกต์โฟลเดอร์ปัจจุบัน เพื่อเริ่มต้นระบบติดตามการแก้ไขประวัติงาน",
    parameters: [
      { key: "project", label: "ชื่อโปรเจกต์โฟลเดอร์", type: "text", defaultValue: "my-web-app" }
    ],
    explanation: [
      "สร้างโฟลเดอร์ระบบซ่อนชื่อ .git ขึ้นมาเพื่อจัดเก็บไฟล์ประวัติ",
      "เป็นจุดเริ่มต้นในการทำงาน of Git บนเครื่องของตนเอง",
      "เครื่องจะเตรียมกิ่งหลักเริ่มต้นขึ้นมารอใช้ในสถานะ Offline"
    ],
    successOutput: (params) => `Initialized empty Git repository in C:/projects/${params.project || "my-web-app"}/.git/\n# สร้างฐานข้อมูลติดตามประวัติเรียบร้อย!`
  },
  clone: {
    id: "clone",
    category: "2. เริ่มโปรเจกต์ (Starting a Project)",
    title: "git clone",
    icon: Laptop,
    subtitle: "ดาวน์โหลดโปรเจกต์ลงเครื่องของคุณ",
    command: (params) => `git clone ${params.url}`,
    description: "ดึงไฟล์โค้ด ประวัติเวอร์ชันย้อนหลังทั้งหมด และกิ่งก้าน (branches) จากคลาวด์มาสร้างเป็นโฟลเดอร์งานเริ่มต้นในเครื่องตนเอง",
    parameters: [
      { key: "url", label: "GitLab Repository URL", type: "text", defaultValue: "https://gitlab.com/company/web-app.git" }
    ],
    explanation: [
      "ดาวน์โหลดกิ่งโค้ดและข้อมูลทั้งหมดของโปรเจกต์มาเริ่มต้นกิ่งใหม่",
      "เชื่อมต่อปลายทางต้นแบบอัตโนมัติ โดยตั้งชื่อรีโมทว่า 'origin'",
      "สร้างโฟลเดอร์ทำงานตรงตามชื่อ Repo พร้อมใช้งานได้ทันที"
    ],
    successOutput: (params) => `Cloning into 'web-app'...\nremote: Enumerating objects: 42, done.\nremote: Counting objects: 100% (42/42), done.\nReceiving objects: 100% (42/42), 856 KiB | 2.4 MiB/s, done.\nResolving deltas: 100% (18/18), done.\n# สิ้นสุดการโคลนคัดลอกไฟล์ลงเครื่องสำเร็จ!`
  },
  status: {
    id: "status",
    category: "3. การทำงานประจำวัน (Day-to-Day)",
    title: "git status",
    icon: Terminal,
    subtitle: "ตรวจสอบความเปลี่ยนแปลงในโฟลเดอร์งาน",
    command: () => `git status`,
    description: "ตรวจสอบความคืบหน้าปัจจุบัน เพื่อระบุว่ามีไฟล์ใดได้รับการเพิ่ม แก้ไข หรือไฟล์ใดอยู่ในสเตจพร้อมนำประวัติบันทึกเข้าสู่คอมมิต",
    parameters: [],
    explanation: [
      "ไฟล์สเตตัสสีแดง: แก้ไขแต่ยังไม่ได้นำเข้าด่านพักเตรียมตัว (Unstaged)",
      "ไฟล์สเตตัสสีเขียว: ดึงเข้าด่านพักของแล้ว รอทำคอมมิตจารึกถัดไป (Staged)",
      "ป้องกันไม่ให้เผลอทำคอมมิตไฟล์ส่วนเกินหรือไม่จำเป็นขึ้นสู่คลาวด์"
    ],
    successOutput: () => `On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\tmodified:   index.html\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tapp.jsx\n\nno changes added to commit (use "git add" and/or "git commit -a")`
  },
  add: {
    id: "add",
    category: "3. การทำงานประจำวัน (Day-to-Day)",
    title: "git add",
    icon: FolderOpen,
    subtitle: "เตรียมไฟล์เพื่อแพ็คพร้อมบันทึกประวัติ",
    command: (params) => `git add ${params.file}`,
    description: "จัดคิวการเปลี่ยนแปลงของไฟล์ ย้ายจากด่านแก้ไขในเครื่องเข้าสู่คิวเตรียมพร้อม (Staging Area) สำหรับส่งจัดจัดทำเวอร์ชันถัดไป",
    parameters: [
      { key: "file", label: "ชื่อไฟล์ที่ต้องการบันทึก (ระบุ . เพื่อเก็บทั้งหมด)", type: "text", defaultValue: "." }
    ],
    explanation: [
      "คำสั่ง git add . จะนำเข้าไฟล์ทั้งหมดที่มีการเปลี่ยนแปลงในระบบ",
      "เปลี่ยนสภาพไฟล์จากสถานะสีแดงเป็นสีเขียวเพื่อเตรียมความพร้อม",
      "เปรียบเสมือนการนำสิ่งของรวบใส่กล่องก่อนกด Commit ปิดผนึกฝากล่อง"
    ],
    successOutput: (params) => `# ดึงการแก้ไขของไฟล์ "${params.file || "."}" เข้าสู่ Staging Area สำเร็จ!\n# ไฟล์พร้อมสำหรับการพิมพ์คอมมิตบันทึกประวัติแล้ว (Staged status)`
  },
  diff: {
    id: "diff",
    category: "3. การทำงานประจำวัน (Day-to-Day)",
    title: "git diff",
    icon: FileCode,
    subtitle: "ดูการเปลี่ยนแปลงของไฟล์โค้ดแบบบรรทัด",
    command: () => "git diff",
    description: "ใช้ตรวจสอบและเปรียบเทียบโค้ดอย่างละเอียดว่ามีบรรทัดใดที่ถูกแก้ไข เพิ่มเติม หรือลบทิ้งไป ก่อนที่เราจะทำความสะอาดโค้ดเพื่อนำส่งเข้าด่านจัดเก็บ",
    parameters: [],
    explanation: [
      "แสดงสัญลักษณ์ - นำหน้าบรรทัดโค้ดสีแดง หมายถึงบรรทัดที่ถูกตัดลบทิ้งไป",
      "แสดงสัญลักษณ์ + นำหน้าบรรทัดโค้ดสีเขียว หมายถึงบรรทัดที่เพิ่งเขียนเสริมเข้ามาใหม่",
      "เปรียบเทียบระหว่างไฟล์ด่านปัจจุบันกับคอมมิตเวอร์ชันล่าสุดในเครื่อง"
    ],
    successOutput: () => `diff --git a/index.html b/index.html\nindex 8f31b2..a3b4e9 100644\n--- a/index.html\n+++ b/index.html\n@@ -5,4 +5,5 @@\n- <p>Hello World</p>\n+ <p>Hello GitLab Simulator</p>\n+ <button>Click me</button>\n# วิเคราะห์ความแตกต่างบรรทัดเสร็จสิ้น!`
  },
  commit: {
    id: "commit",
    category: "3. การทำงานประจำวัน (Day-to-Day)",
    title: "git commit",
    icon: Code,
    subtitle: "จารึกประวัติและเหตุการณ์เวอร์ชันลงฮาร์ดดิสก์",
    command: (params) => `git commit -m "${params.message}"`,
    description: "การยืนยันประทับตราบันทึกเวอร์ชันเก็บเข้าฐานข้อมูลของตัวเครื่องเป็นหนึ่งเวอร์ชัน พร้อมจดข้อความกำกับอธิบายเหตุการณ์แก้ไข",
    parameters: [
      { key: "message", label: "ข้อความคอมมิต (Commit Message)", type: "text", defaultValue: "feat: add user authentication form" }
    ],
    explanation: [
      "ข้อความหลังธง -m ควรสรุปความเปลี่ยนแปลงให้กระชับและได้ใจความ",
      "เกิดรหัสจดจำเฉพาะตัวที่เรียกว่า Commit Hash เช่น f8e5f22",
      "บันทึกประวัติอยู่ในระดับฮาร์ดดิสก์เครื่องเรา ยังไม่ส่งไปที่อินเทอร์เน็ต"
    ],
    successOutput: (params) => `[main f8e5f22] ${params.message}\n 2 files changed, 25 insertions(+), 4 deletions(-)\n create mode 100644 app.jsx\n# บันทึกประวัติและประทับตรายืนยัน Commit f8e5f22 สำเร็จ!`
  },
  checkout_file: {
    id: "checkout_file",
    category: "3. การทำงานประจำวัน (Day-to-Day)",
    title: "git checkout --",
    icon: RotateCcw,
    subtitle: "ลบล้างการแก้ไขไฟล์ ย้อนสู่คอมมิตล่าสุด",
    command: (params) => `git checkout -- ${params.file}`,
    description: "ยกเลิกการเปลี่ยนแปลงทั้งหมดในไฟล์ที่ระบุเพื่อดึงเนื้อหาต้นฉบับล่าสุดจากบันทึกคอมมิตกลับมาใช้งานแทน แก้ไขปัญหาเผลอเขียนบั๊กหรือเผลอแก้งานผิดพลาด",
    parameters: [
      { key: "file", label: "ชื่อไฟล์ที่ต้องการยกเลิกการแก้ไข", type: "text", defaultValue: "index.html" }
    ],
    explanation: [
      "ช่วยคืนค่าไฟล์ที่พิมพ์โค้ดผิดพลาดให้สะอาดกลับสู่เวอร์ชันของจุดเซฟล่าสุด",
      "**คำเตือน:** คำสั่งนี้ไม่สามารถย้อนคืนกลับมาใหม่ได้ โค้ดที่เขียนคาไว้จะหายไปทันที",
      "ยืดหยุ่นในการคืนค่าโดยไม่ต้องลบสร้างใหม่ทั้งหมด"
    ],
    successOutput: (params) => `# ยกเลิกการแก้ไขของไฟล์ "${params.file || "index.html"}" สำเร็จ!\n# ไฟล์ย้อนกลับสู่สถานะดั้งเดิม (Reverted to latest commit)`
  },
  branch_list: {
    id: "branch_list",
    category: "4. สาขาการทำงาน (Branching)",
    title: "git branch",
    icon: GitBranch,
    subtitle: "แสดงกิ่งสาขาทั้งหมดในเครื่องและเซิร์ฟเวอร์",
    command: () => "git branch -a",
    description: "แสดงกิ่งก้านสาขาการพัฒนา (Branches) ทั้งหมดที่มีอยู่ในโฟลเดอร์เครื่องเรา รวมถึงกิ่งจำลองปลายทางที่อยู่บนเซิร์ฟเวอร์ GitLab คลาวด์เพื่อการเชื่อมงาน",
    parameters: [],
    explanation: [
      "แสดงสัญลักษณ์ * อยู่หน้ากิ่งปัจจุบันที่คุณเปิดทำงานอยู่",
      "remotes/origin/ แสดงถึงสาขาปลายทางที่บันทึกอยู่บนระบบ GitLab คลาวด์",
      "ช่วยยืนยันตำแหน่งกิ่งเพื่อไม่ให้ส่งงานสลับช่องทางกิ่งก้านกัน"
    ],
    successOutput: () => `* main\n  feature/auth-page\n  remotes/origin/main\n  remotes/origin/feature/auth-page\n# เรียกรายงานกิ่งสาขาทั้งหมดสำเร็จ!`
  },
  checkout_branch: {
    id: "checkout_branch",
    category: "4. สาขาการทำงาน (Branching)",
    title: "git checkout -b",
    icon: GitBranch,
    subtitle: "แตกสาขาใหม่และสลับกิ่งทำงาน",
    command: (params) => `git checkout -b ${params.branch}`,
    description: "ใช้แยกกิ่งไปเขียนฟังก์ชันฟีเจอร์ย่อยต่าง ๆ อย่างเป็นอิสระ โดยไม่กระทบกิ่งหลักจนกว่าจะทำการตรวจสอบความเรียบร้อยของโค้ดเสร็จสิ้น",
    parameters: [
      { key: "branch", label: "ชื่อกิ่งใหม่ที่จะแยกออก (Branch)", type: "text", defaultValue: "feature/auth-page" }
    ],
    explanation: [
      "การใช้ -b เพื่อสร้างกิ่งใหม่ (ถ้าไม่มี -b จะเป็นคำสั่งสลับไปยังกิ่งที่เคยสร้างไว้แล้ว)",
      "สลับสภาพแวดล้อมจำลองของไฟล์ทำให้แก้ไขงานต่าง ๆ ได้อย่างอิสระ",
      "เตรียมพร้อมสำหรับการส่ง Merge Request บน GitLab เพื่อส่งงาน"
    ],
    successOutput: (params) => `Switched to a new branch '${params.branch}'\n# ขณะนี้คุณกำลังทำงานขนานอยู่บนกิ่ง "${params.branch}"`
  },
  merge: {
    id: "merge",
    category: "4. สาขาการทำงาน (Branching)",
    title: "git merge",
    icon: GitBranch,
    subtitle: "ผสานประวัติกิ่งย่อยเข้าสู่กิ่งหลัก",
    command: (params) => `git merge ${params.branch}`,
    description: "ดึงเอาประวัติการเปลี่ยนแปลงและการอัปเดตไฟล์ของกิ่งเป้าหมายที่เขียนเสร็จสมบูรณ์แล้ว มาหลอมผสานรวมเข้ากับกิ่งหลักปัจจุบันที่คุณสลับหัวทำงานค้างอยู่",
    parameters: [
      { key: "branch", label: "ชื่อกิ่งที่จะดึงมาผสาน (Target branch)", type: "text", defaultValue: "feature/auth-page" }
    ],
    explanation: [
      "เป็นการสมานไฟล์และประวัติการเดินทางของเวอร์ชันรวมร่างกัน",
      "หากไม่มีจุดแย่งขัดแย้งของบรรทัดโค้ด จะทำการรวมแบบ Fast-forward สำเร็จทันที",
      "หากมี Conflict หรือไฟล์ขัดแย้งกัน Git จะสั่งให้เลือกยอมรับฉบับที่ถูกต้องก่อนจบงาน"
    ],
    successOutput: (params) => `Updating f8e5f22..c3a4f9a\nFast-forward\n auth.jsx | 18 +++++++++++++++\n 1 file changed, 18 insertions(+)\n# รวมประวัติกิ่ง "${params.branch || "feature/auth-page"}" เข้าสู่กิ่งปัจจุบันเรียบร้อย!`
  },
  rebase: {
    id: "rebase",
    category: "4. สาขาการทำงาน (Branching)",
    title: "git rebase",
    icon: ArrowRightLeft,
    subtitle: "ย้ายรากประวัติกิ่งไปต่อยอดที่ปลายสุด",
    command: (params) => `git rebase ${params.branch}`,
    description: "นำเอาคอมมิตของสาขากิ่งเราไปตัดต่อต่อยอดไว้ที่หัวบนสุดของกิ่งปลายทาง เพื่อไม่ให้เกิดประวัติกิ่งแยกซิกแซก ช่วยให้จัดระเบียบสายเวลาการเดินทางของโค้ดให้ตรงเป็นเส้นเดียว",
    parameters: [
      { key: "branch", label: "กิ่งหลักที่จะไปตั้งฐานต่อยอด (Base branch)", type: "text", defaultValue: "main" }
    ],
    explanation: [
      "ช่วยปรับโครงสร้างประวัติการแก้ไขโปรเจกต์ให้อ่านง่ายเป็นเส้นตรงระเบียบดี",
      "ตัดประวัติคอมมิตย่อยของเราชั่วคราว ดึงอัปเดตกิ่งปลายทางมา แล้วเขียนคอมมิตเราต่อท้ายสุด",
      "นิยมใช้อัปเดตกิ่งตนเองให้ทันโค้ดหลักล่าสุดของทีมก่อนส่งงาน Merge Request"
    ],
    successOutput: (params) => `First, rewinding head to replay your work on top of it...\nApplying: feat: add login button ui\n# เรียงต่อยอดคอมมิตบนหัวกิ่ง "${params.branch || "main"}" สำเร็จ!`
  },
  pull: {
    id: "pull",
    category: "5. รีโมทเซิร์ฟเวอร์ (Remote)",
    title: "git pull",
    icon: Server,
    subtitle: "ดึงโค้ดล่าสุดจากทีมรวมเข้ากับกิ่งเครื่องเรา",
    command: (params) => `git pull origin ${params.branch}`,
    description: "ดาวน์โหลดประวัติอัปเดตและไฟล์ล่าสุดที่มีทีมงานส่งขึ้นไปบน GitLab Server นำลงมาหลอมรวมเข้ากับกิ่งโค้ดที่เครื่องคอมพิวเตอร์ของคุณ",
    parameters: [
      { key: "branch", label: "ชื่อกิ่งที่จะดึงข้อมูลมาอัปเดต (Branch)", type: "text", defaultValue: "main" }
    ],
    explanation: [
      "รวบรวมคำสั่งดึงข้อมูลล่าสุดและทำการควบรวมข้อมูลเสร็จสรรพในคลิกเดียว",
      "แนะนำให้สั่งรันคำสั่งนี้ทุกเช้าเพื่อหลีกเลี่ยงโอกาสโค้ดชนขัดแย้งกัน",
      "หากประวัติขัดแย้งกัน Git จะบอกให้ตรวจสอบจุดทับซ้อนและแก้ Conflict"
    ],
    successOutput: (params) => `remote: Enumerating objects: 4, done.\nremote: Counting objects: 100% (4/4), done.\nUnpacking objects: 100% (3/3), 320 bytes, done.\nFrom https://gitlab.com/company/web-app.git\n   f8e5f..c3b8a  ${params.branch} -> origin/${params.branch}\nUpdating f8e5f..c3b8a\nFast-forward\n app.jsx | 12 ++++++++++++\n 1 file changed, 12 insertions(+)\n# รวมประวัติล่าสุดของทีมเข้าสู่เครื่องเรียบร้อย!`
  },
  push: {
    id: "push",
    category: "5. รีโมทเซิร์ฟเวอร์ (Remote)",
    title: "git push",
    icon: Server,
    subtitle: "อัปโหลดกลุ่มประวัติขึ้นเซิร์ฟเวอร์ GitLab",
    command: (params) => `git push origin ${params.branch}`,
    description: "นำส่งกิ่งข้อมูล Commit ทั้งหมดในเครื่องที่เราทำไว้ ส่งผ่านอินเทอร์เน็ตขึ้นคลาวด์ไปเขียนรวมบน GitLab Server เพื่อความปลอดภัยและแชร์แบ่งงาน",
    parameters: [
      { key: "branch", label: "ชื่อกิ่งที่จะส่งขึ้น (Branch)", type: "text", defaultValue: "main" }
    ],
    explanation: [
      "origin คือชื่อตำแหน่งของ GitLab Server ที่โคลนมา",
      "อัปโหลดกลุ่มงานไปที่กิ่งปลายทางที่ระบุให้เป็นประวัติเวอร์ชันล่าสุด",
      "เพื่อนร่วมงานคนอื่น ๆ จะสามารถดึงงานส่วนนี้ของคุณไปสานต่อได้"
    ],
    successOutput: (params) => `Enumerating objects: 6, done.\nCounting objects: 100% (6/6), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (4/4), done.\nWriting objects: 100% (4/4), 450 bytes | 450.00 KiB/s, done.\nTo https://gitlab.com/company/web-app.git\n   a1d9c..f8e5f  main -> ${params.branch}\n# ดันประวัติโค้ดเครื่องคุณขึ้นสู่ GitLab สำเร็จ!`
  },
  stash: {
    id: "stash",
    category: "6. การเก็บงานชั่วคราว (Storing)",
    title: "git stash",
    icon: Database,
    subtitle: "เก็บซ่อนโค้ดชั่วคราวโดยไม่ต้องพิมพ์ Commit",
    command: () => `git stash\n# ดึงโค้ดที่ซ่อนไว้กลับคืนมาทำงานต่อ:\ngit stash pop`,
    description: "ใช้รูดซิปเก็บงานที่แก้ค้างไว้เพื่อเปลี่ยนไปเขียนกิ่งอื่นชั่วคราว โดยไม่ต้อง Commit งานขยะเก็บไว้ เมื่อกลับมาทำงานเดิมสามารถดึงออกมาแก้ต่อได้ทันที",
    parameters: [],
    explanation: [
      "git stash: ย้ายไฟล์งานปัจจุบันลงกล่องเก็บชั่วคราว ทำให้โฟลเดอร์สะอาด",
      "git stash pop: ดึงไฟล์เก็บล่าเอาออกมาทำงานต่อที่เครื่องคุณจุดเดิม",
      "เหมาะอย่างยิ่งสำหรับการแก้บั๊กเร่งด่วนที่กิ่งหลักระหว่างทำงานค้างอยู่"
    ],
    successOutput: (params, step) => {
      if (step === 1 || step === 2) {
        return `Saved working directory and index state WIP on main: f8e5f22 WIP on main\n# ซ่อนงานเรียบร้อย (Working Directory สะอาด)`;
      }
      if (step === 3) {
        return `Saved working directory and index state WIP on main: f8e5f22 WIP on main\n\n$ git stash pop\nOn branch main\nChanges not staged for commit:\n\tmodified:   stash_code.html\n\nDropped refs/stash@{0} (a8e4f1a1...)\n# กู้คืนไฟล์งานกลับคืนเก๊ะและทำงานต่อเรียบร้อย!`;
      }
      return "";
    }
  },
  tag_create: {
    id: "tag_create",
    category: "7. ป้ายกำกับ (Tagging)",
    title: "git tag -a",
    icon: Bookmark,
    subtitle: "สร้างป้ายกำกับเวอร์ชัน (Release Tag)",
    command: (params) => `git tag -a ${params.version} -m "${params.message}"`,
    description: "สร้างป้ายติดกำกับลงจุดบันทึกคอมมิตที่ต้องการ (เช่น เวอร์ชันเสร็จผลิตจริง v1.0.0) เพื่อระบุจุดไมล์สโตนที่สำคัญของความก้าวหน้าโปรเจกต์",
    parameters: [
      { key: "version", label: "ชื่อเวอร์ชันป้าย (Tag Version)", type: "text", defaultValue: "v1.0.0" },
      { key: "message", label: "ข้อความกำกับป้าย (Tag Message)", type: "text", defaultValue: "Release version 1.0.0" }
    ],
    explanation: [
      "มักนิยมตั้งชื่อเวอร์ชันในฟอร์แมต Semantic Versioning เช่น v1.0.0, v2.1.3",
      "ป้ายกำกับนี้จะติดตรึงอยู่กับรหัส Commit ปัจจุบันอย่างเหนียวแน่นถาวร",
      "ใช้สำหรับสร้างแถบดาวน์โหลด Release Assets สะดวกสบายบนเว็บ GitLab"
    ],
    successOutput: (params) => `# สร้างป้ายกำกับเวอร์ชันสำเร็จ!\n# tag: ${params.version || "v1.0.0"}\n# message: "${params.message || "Release version 1.0.0"}"`
  },
  tag_push: {
    id: "tag_push",
    category: "7. ป้ายกำกับ (Tagging)",
    title: "git push origin [tag]",
    icon: Bookmark,
    subtitle: "ดันส่งป้ายกำกับเวอร์ชันขึ้นเซิร์ฟเวอร์ GitLab",
    command: (params) => `git push origin ${params.version}`,
    description: "ปกติคำสั่งดันโค้ด (git push) ทั่วไปจะไม่ดันป้ายเวอร์ชันไปหาคลาวด์ด้วย ต้องพิมพ์ระบุตัวป้ายเป้าหมายส่งไป เพื่อให้หน้าเว็บ GitLab แสดงแท็บ Releases ขึ้นอัปโหลดไฟล์",
    parameters: [
      { key: "version", label: "ชื่อเวอร์ชันป้ายที่จะส่งขึ้น (Tag Name)", type: "text", defaultValue: "v1.0.0" }
    ],
    explanation: [
      "ส่งป้ายกำกับเฉพาะตัวไปยังระบบคลาวด์ต้นแบบ origin",
      "ทำให้เพื่อนร่วมทีมหรือฝ่ายโปรดักชันเข้ามากดดึงรหัส Release ของรุ่นนั้นได้",
      "สามารถดันป้ายทั้งหมดในเครื่องพร้อมกันโดยพิมพ์ git push origin --tags"
    ],
    successOutput: (params) => `* [new tag]         ${params.version || "v1.0.0"} -> ${params.version || "v1.0.0"}\n# ดันส่งป้ายกำกับเวอร์ชันเครื่องคุณขึ้นสู่ GitLab Cloud สำเร็จ!`
  }
};

function HighlightedCommand({ commandText, outputText, showOutput }) {
  if (!commandText) return null;
  const lines = commandText.split("\n");

  return (
    <div className="font-mono text-left select-all py-1 overflow-x-auto whitespace-pre leading-relaxed text-[11px]">
      {lines.map((line, lIdx) => {
        if (line.startsWith("#")) {
          return (
            <div key={lIdx} className="text-slate-500 italic text-[10px]">
              {line}
            </div>
          );
        }

        const tokens = line.split(" ");
        return (
          <div key={lIdx} className="flex flex-wrap items-center gap-x-1.5 min-h-[1.5rem]">
            {lIdx === 0 && <span className="text-emerald-450 font-semibold select-none">$ </span>}
            {tokens.map((token, tIdx) => {
              let colorClass = "text-slate-100";
              if (token === "git") {
                colorClass = "text-fuchsia-450 font-extrabold";
              } else if (["config", "init", "clone", "status", "add", "diff", "commit", "checkout", "branch", "merge", "rebase", "push", "pull", "stash", "pop", "tag"].includes(token)) {
                colorClass = "text-sky-400 font-bold";
              } else if (token.startsWith("-") || token.startsWith("--")) {
                colorClass = "text-amber-400 font-medium";
              } else if (token.startsWith('"') || token.endsWith('"') || token.startsWith("'") || token.endsWith("'")) {
                colorClass = "text-emerald-450";
              } else if (token.startsWith("https://") || token.includes("git@")) {
                colorClass = "text-indigo-300 underline underline-offset-4";
              } else if (token === "origin" || token === "master" || token === "main") {
                colorClass = "text-teal-355 font-semibold";
              }
              return (
                <span key={tIdx} className={colorClass}>
                  {token}
                </span>
              );
            })}
          </div>
        );
      })}

      {/* Render Git Command Output Lines on Success */}
      <AnimatePresence>
        {showOutput && outputText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
            className="border-t border-white/5 mt-2 pt-2 text-slate-455 border-dashed"
          >
            {outputText.split("\n").map((oLine, oIdx) => {
              let lineClass = "text-slate-400";
              if (oLine.startsWith("#")) {
                lineClass = "text-emerald-400/90 font-bold italic";
              } else if (oLine.startsWith("$")) {
                lineClass = "text-fuchsia-455 font-bold";
              } else if (oLine.includes("modified:") || oLine.includes("Changes not staged:") || oLine.startsWith("-")) {
                lineClass = "text-red-400 font-semibold";
              } else if (oLine.includes("Untracked files:") || oLine.includes("app.jsx") || oLine.startsWith("+") || oLine.includes("[new tag]")) {
                lineClass = "text-emerald-400 font-semibold";
              } else if (oLine.includes("Fast-forward") || oLine.includes("files changed")) {
                lineClass = "text-emerald-355 font-bold";
              }
              
              return (
                <div key={oIdx} className={cn("min-h-[1.2rem]", lineClass)}>
                  {oLine}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("1. การตั้งค่า (Configuration)");
  const [selectedKey, setSelectedKey] = useState("config");
  const [copied, setCopied] = useState(false);
  const [params, setParams] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);

  const selectedCommand = COMMANDS[selectedKey];

  // Map category change to select its first command automatically
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const firstCmdOfCategory = Object.values(COMMANDS).find(c => c.category === category);
    if (firstCmdOfCategory) {
      setSelectedKey(firstCmdOfCategory.id);
    }
  };

  useEffect(() => {
    const defaultParams = {};
    if (selectedCommand && selectedCommand.parameters) {
      selectedCommand.parameters.forEach((p) => {
        defaultParams[p.key] = p.defaultValue;
      });
    }
    setParams(defaultParams);
    setShowHint(false);
  }, [selectedKey]);

  useEffect(() => {
    setIsAnimating(true);
    setAnimationStep(0);

    const t1 = setTimeout(() => setAnimationStep(1), 1200);
    const t2 = setTimeout(() => setAnimationStep(2), 2600);
    const t3 = setTimeout(() => setAnimationStep(3), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [selectedKey, triggerKey]);

  const copyToClipboard = () => {
    const rawCommand = selectedCommand.command(params);
    navigator.clipboard.writeText(rawCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleParamChange = (key, val) => {
    setParams((prev) => ({ ...prev, [key]: val }));
    setTriggerKey((prev) => prev + 1);
  };

  const triggerAnimationManual = () => {
    setTriggerKey((prev) => prev + 1);
  };

  const activeCategoryCommands = useMemo(() => {
    return Object.values(COMMANDS).filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden p-6 md:p-7 lg:p-8 flex flex-col gap-4 text-slate-800 bg-[radial-gradient(circle_at_15%_15%,rgba(199,210,254,0.55),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(216,180,254,0.45),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(167,243,208,0.3),transparent_40%),linear-gradient(135deg,#f0f4fa,#fafcff_45%,#fff9fd)]">
      
      {/* Background Animated Gradient Mesh */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.98, 1],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[8%] left-[8%] h-[280px] w-[280px] rounded-full bg-sky-200/20 blur-[70px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -50, 0],
            scale: [1, 0.98, 1.05, 1],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[12%] h-[320px] w-[320px] rounded-full bg-indigo-200/20 blur-[80px]"
        />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-10 z-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      {/* Header - Less Curved corners */}
      <motion.header 
        initial={{ opacity: 0, y: -8 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative z-10 rounded-xl border border-white/50 bg-white/20 p-4 shadow-xl backdrop-blur-3xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between flex-shrink-0"
      >
        <div className="space-y-0.5">
          <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent">
            GitLab Commands Visual Simulator ⚡
          </h1>
          <p className="text-[10px] text-slate-500 font-bold">บอร์ดแอนิเมชันคำสั่ง Git อ้างอิงตามโครงสร้าง GitLab Git Cheat Sheet คู่มือทางการ</p>
        </div>

        <div className="flex gap-2">
          <div className="rounded-lg border border-white/45 bg-white/45 px-3 py-1.5 flex items-center gap-2 shadow-sm text-[10px] font-bold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 indicator-pulse" />
            <span>GitLab Link Host</span>
          </div>
        </div>
      </motion.header>

      {/* Category Segmented Control Navigation - High End stripe feel */}
      <div className="relative z-10 overflow-x-auto no-scrollbar py-0.5 flex-shrink-0 flex gap-2">
        <div className="flex gap-2 p-1.5 rounded-xl border border-slate-200/50 bg-white/40 backdrop-blur-2xl w-max shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          {CATEGORIES_CONFIG.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const Icon = cat.icon;
            return (
              <button 
                key={cat.name} 
                onClick={() => handleCategorySelect(cat.name)} 
                className={cn(
                  "relative z-10 rounded-lg px-4 py-2.5 text-[9.5px] font-extrabold uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center gap-2 select-none",
                  isSelected 
                    ? "text-slate-950 font-black" 
                    : "text-slate-500 hover:text-slate-800 hover:-translate-y-0.5"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-indigo-600" : "text-slate-400")} />
                <span>{cat.label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 z-[-1] rounded-lg bg-white border border-white/80 shadow-[0_3px_10px_rgba(0,0,0,0.05)]"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Category Command Pills Grid - Linear/Vercel styling */}
      <div className="relative z-10 flex gap-2.5 flex-wrap flex-shrink-0">
        {activeCategoryCommands.map((cmd) => {
          const isSelected = selectedKey === cmd.id;
          const CmdIcon = cmd.icon || Code;
          return (
            <button
              key={cmd.id}
              onClick={() => setSelectedKey(cmd.id)}
              className={cn(
                "rounded-lg px-4 py-3 text-[10px] font-bold font-mono transition-all duration-200 cursor-pointer flex items-center gap-2 select-none border active:scale-97",
                isSelected
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-650 to-violet-600 border-indigo-500 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)] scale-[1.02]"
                  : "bg-white/40 border-slate-200/50 hover:border-slate-350 text-slate-700 hover:text-slate-950 hover:bg-white/70 hover:-translate-y-0.5 hover:shadow-sm"
              )}
            >
              <span className={cn("font-mono text-[9px] opacity-60 font-medium", isSelected ? "text-indigo-200" : "text-slate-400")}>$</span>
              <CmdIcon className={cn("h-3.5 w-3.5", isSelected ? "text-white" : "text-slate-500")} />
              <span>{cmd.title}</span>
              {isSelected && (
                <motion.span 
                  layoutId="activeDot"
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 indicator-pulse"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main workspace - Side by Side layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 relative z-10 overflow-hidden">
        
        {/* Left Side: Visualizer Canvas Card */}
        <div className="rounded-xl flex-1 min-h-0 bg-white/20 border border-white/50 shadow-xl backdrop-blur-3xl p-5 flex flex-col justify-between overflow-hidden relative">
          
          {/* Visualizer Floating Headers */}
          <div className="flex items-center justify-between flex-shrink-0 z-10 pb-2 border-b border-slate-300/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black text-slate-800">{selectedCommand.title}</span>
              <span className="text-[10px] text-slate-405 font-semibold truncate">({selectedCommand.subtitle})</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowHint((prev) => !prev)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-[10px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 shadow-sm border",
                  showHint 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white/60 hover:bg-white text-slate-700 border-white/50"
                )}
              >
                💡 คำอธิบาย (Hint)
              </button>
              <button
                onClick={triggerAnimationManual}
                className="rounded-lg bg-slate-950 text-white text-[10px] font-bold px-3 py-1.5 hover:bg-slate-800 shadow-md active:scale-97 transition cursor-pointer flex items-center gap-1"
              >
                <Play className="h-3 w-3 fill-current text-emerald-455" /> เล่นใหม่
              </button>
            </div>
          </div>

          {/* Sandbox Animation Viewport */}
          <div className="flex-1 min-h-0 w-full rounded-lg border border-white/15 bg-slate-950/95 overflow-hidden flex flex-col justify-between p-4 my-3.5 relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

            <AnimationSandbox type={selectedCommand.id} isPlaying={isAnimating} step={animationStep} params={params} />

            {/* Floating Glass Hint Popover */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  className="absolute inset-x-4 top-4 rounded-lg border border-white/20 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl text-white space-y-3 z-30 max-h-[90%] overflow-y-auto no-scrollbar"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-xs font-black tracking-tight text-indigo-400 flex items-center gap-1.5">
                      💡 คำอธิบายเกี่ยวกับ {selectedCommand.title}
                    </h4>
                    <button 
                      onClick={() => setShowHint(false)} 
                      className="rounded-full p-1 bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 transition cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed font-medium text-slate-200">{selectedCommand.description}</p>
                  
                  <div className="grid gap-1.5 text-[10px] text-slate-400 font-semibold pt-1">
                    {selectedCommand.explanation.map((exp, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">✓</span>
                        <span className="leading-tight">{exp}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Parameter Settings bar inside the Visualizer Card */}
          <AnimatePresence mode="wait">
            {selectedCommand.parameters.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="rounded-lg border border-white/35 bg-white/20 p-2.5 backdrop-blur-xl shadow-inner flex-shrink-0 overflow-hidden mb-1"
              >
                <div className="flex flex-wrap items-center gap-3.5 px-1.5">
                  <span className="text-[9px] font-extrabold text-indigo-650 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Settings className="h-3.5 w-3.5" /> อาร์กิวเมนต์จำลอง:
                  </span>
                  <div className="flex-1 flex gap-3">
                    {selectedCommand.parameters.map((p) => (
                      <div key={p.key} className="bg-white/80 rounded-lg px-3 py-1 border border-slate-200 shadow-sm flex items-center gap-2">
                        <label className="text-[8px] font-extrabold text-indigo-500 uppercase tracking-widest">{p.label}:</label>
                        <input
                          type={p.type}
                          value={params[p.key] || ""}
                          onChange={(e) => handleParamChange(p.key, e.target.value)}
                          className="bg-transparent text-[10px] text-slate-800 font-extrabold outline-none w-[120px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right Side: Terminal Console Mockup */}
        <div className="w-full lg:w-[420px] rounded-xl bg-[#090A14] p-4 text-white text-[11px] border border-white/5 shadow-2xl relative flex-shrink-0 h-[240px] lg:h-auto flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-2 text-slate-500 font-mono text-[8px] select-none flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
              <span className="ml-1 font-semibold text-slate-500">terminal-console-output</span>
            </div>
            <Terminal className="h-3.5 w-3.5 text-slate-500" />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-1">
            <HighlightedCommand 
              commandText={selectedCommand.command(params)} 
              outputText={selectedCommand.successOutput ? selectedCommand.successOutput(params, animationStep) : ""}
              showOutput={isAnimating && animationStep >= (selectedCommand.id === "status" || selectedCommand.id === "diff" || selectedCommand.id === "branch_list" ? 0 : 2)}
            />
          </div>

          <div className="flex-shrink-0 pt-2 border-t border-white/5 flex items-center justify-between text-[8.5px] text-slate-500 font-mono select-none">
            <span>Lines: {selectedCommand.command(params).split("\n").length}</span>
            <button
              onClick={copyToClipboard}
              className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white px-2 py-1 rounded border border-white/10 transition cursor-pointer flex items-center gap-1"
              title="คัดลอกคำสั่ง"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-450" /> คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> คัดลอกโค้ด
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

// 5. Visual Simulation Canvas render components
function AnimationSandbox({ type, isPlaying, step, params }) {
  
  if (type === "config") {
    return (
      <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-6 relative text-white min-h-0">
        
        {/* User Card - Less Curved corners */}
        <motion.div
          animate={isPlaying ? { scale: [1, 1.05, 0.98, 1], rotate: [0, 2, -2, 0] } : {}}
          transition={{ duration: 2 }}
          className="rounded-xl border border-white/15 bg-white/5 p-4.5 w-[170px] flex flex-col items-center gap-3 shadow-xl backdrop-blur-md relative flex-shrink-0"
        >
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center font-black text-xl shadow-lg border-2 border-white/35 relative">
            {params.name ? params.name.charAt(0) : "U"}
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-400 border-2 border-slate-950 indicator-pulse" />
          </div>
          <div className="text-center min-w-0 w-full space-y-0.5">
            <div className="text-[11px] font-extrabold truncate text-white">{params.name || "Username"}</div>
            <div className="text-[9px] text-slate-400 truncate">{params.email || "Email"}</div>
          </div>
        </motion.div>

        {/* Action arrow beam */}
        <div className="h-0.5 w-[60px] bg-white/10 rounded-full relative hidden md:block flex-shrink-0">
          {isPlaying && step > 0 && (
            <motion.div 
              initial={{ left: 0 }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute h-2.5 w-2.5 rounded-full bg-indigo-405 -top-[4px] shadow-[0_0_8px_rgb(99,102,241)]"
            />
          )}
        </div>

        {/* Config File - Less Curved corners */}
        <motion.div
          animate={isPlaying && step > 1 ? { scale: [1, 1.03, 1], borderColor: ["rgba(255,255,255,0.15)", "rgba(52,199,89,0.4)", "rgba(255,255,255,0.15)"] } : {}}
          transition={{ duration: 1 }}
          className="rounded-lg border border-white/15 bg-[#0C0E1A] p-4 w-[200px] font-mono text-[9px] space-y-2.5 text-left shadow-xl flex-shrink-0 relative overflow-hidden"
        >
          <div className="text-indigo-400 font-extrabold border-b border-white/5 pb-1 flex items-center gap-1 select-none">
            <FileCode className="h-3 w-3" /> ~/.gitconfig
          </div>
          <div className="space-y-0.5 text-slate-350">
            <div className="text-slate-500 font-bold">[user]</div>
            <div className="flex gap-1.5 pl-3 items-center min-h-[1.2rem]">
              <span className="text-slate-555">name =</span>
              {isPlaying && step > 1 ? (
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.8 }}
                  className="text-emerald-400 font-bold truncate flex items-center gap-0.5"
                >
                  "{params.name}"
                  <span className="h-3 w-1.5 bg-emerald-400 terminal-cursor inline-block" />
                </motion.span>
              ) : (
                <span className="text-slate-655 italic">undefined</span>
              )}
            </div>
            <div className="flex gap-1.5 pl-3 items-center min-h-[1.2rem]">
              <span className="text-slate-555">email =</span>
              {isPlaying && step > 1 ? (
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-emerald-400 font-bold truncate flex items-center gap-0.5"
                >
                  "{params.email}"
                  <span className="h-3 w-1.5 bg-emerald-400 terminal-cursor inline-block" />
                </motion.span>
              ) : (
                <span className="text-slate-655 italic">undefined</span>
              )}
            </div>
          </div>
        </motion.div>

        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-emerald-400 font-bold"
          >
            ✓ อัปเดตระบุตัวตนเครื่องสำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "color_ui") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-3 text-white min-h-0">
        <Laptop className="h-10 w-10 text-slate-355" />
        <div className="rounded-lg bg-[#0C0E1A] p-3.5 w-[240px] font-mono text-[9px] text-left border border-white/10 shadow-lg space-y-1.5">
          <div className="text-slate-500 font-bold select-none">$ git status</div>
          {isPlaying && step > 1 ? (
            <div className="leading-relaxed">
              On branch <span className="text-indigo-400 font-bold">main</span><br />
              Changes to be committed:<br />
              &nbsp;&nbsp;<span className="text-emerald-450 font-bold">new file: app.jsx</span><br />
              Changes not staged:<br />
              &nbsp;&nbsp;<span className="text-red-400 font-bold">modified: index.html</span>
            </div>
          ) : (
            <div className="leading-relaxed">
              On branch main<br />
              Changes to be committed:<br />
              &nbsp;&nbsp;new file: app.jsx<br />
              Changes not staged:<br />
              &nbsp;&nbsp;modified: index.html
            </div>
          )}
        </div>
        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            🎨 เปิดใช้งานสีของ Git Console สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "init") {
    return (
      <div className="flex-1 flex items-center justify-center gap-4 text-white min-h-0">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 w-[160px] h-[100px] flex flex-col items-center justify-center relative shadow-lg">
          <FolderOpen className="h-8 w-8 text-indigo-400" />
          <span className="text-[10px] font-bold text-slate-300 mt-2">{params.project || "my-web-app"}</span>
          
          <AnimatePresence>
            {isPlaying && step > 1 && (
              <motion.div
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-3 -right-3 rounded-lg border border-indigo-455 bg-slate-900 px-2 py-1 shadow-2xl flex items-center gap-1.5 text-[8.5px] font-mono text-indigo-300"
              >
                <FolderGit2 className="h-3.5 w-3.5 text-indigo-400" /> .git/
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            ✨ เริ่มต้นคลังประวัติสำเร็จ (Initialized empty .git)
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "clone") {
    return (
      <div className="flex-1 flex items-center justify-around relative text-white min-h-0">
        
        {/* GitLab Server */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/30 p-3.5 shadow-xl flex flex-col gap-1.5 items-center justify-center relative">
            <Server className="h-10 w-10 text-indigo-500 animate-pulse" />
            <div className="flex gap-1 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 indicator-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-405" />
            </div>
          </div>
          <div className="text-center font-bold text-[9px]">
            <div className="text-white">GitLab Server</div>
            <div className="text-indigo-400">web-app.git</div>
          </div>
        </div>

        {/* Transfer pipeline with files flying */}
        <div className="flex-1 h-2 bg-white/5 rounded-full mx-4 relative overflow-hidden max-w-[150px] border border-white/5">
          {isPlaying && (
            <>
              <motion.div
                initial={{ left: "-40px" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-[40px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              />
              {/* Flying Files */}
              {["📁", "📄", "⚙️"].map((icon, idx) => (
                <motion.div
                  key={idx}
                  initial={{ left: "-20px", y: -6 }}
                  animate={{ left: "100%", y: [4, -4, 4], rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: idx * 0.4 }}
                  className="absolute text-xs"
                >
                  {icon}
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Local laptop with file tree expansion */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl bg-white/5 border border-white/15 p-3.5 shadow-xl relative">
            <Laptop className="h-9 w-9 text-slate-350" />
            
            {isPlaying && step > 1 && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-4 bg-indigo-450 rounded blur-sm"
              />
            )}
          </div>
          <div className="text-center font-bold text-[9px]">
            <div className="text-white">เครื่องลูกข่าย (Local)</div>
            {isPlaying && step > 1 ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-emerald-400 uppercase flex items-center gap-0.5 justify-center mt-0.5"
              >
                <FolderGit2 className="h-3.5 w-3.5" /> โคลนสำเร็จ
              </motion.div>
            ) : (
              <div className="text-slate-655 font-normal">Empty Space</div>
            )}
          </div>
        </div>

        {/* Directory popup file tree */}
        <AnimatePresence>
          {isPlaying && step > 1 && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.3, opacity: 0 }}
              className="absolute right-[12%] top-[10%] rounded-lg border border-white/10 bg-slate-900/90 p-2 font-mono text-[8px] space-y-1 shadow-2xl w-[90px] text-left"
            >
              <div className="text-emerald-400 font-bold truncate">📁 app/</div>
              <div className="pl-3 text-slate-300">├── 📁 src/</div>
              <div className="pl-3 text-slate-300">└── 📄 index.html</div>
            </motion.div>
          )}
        </AnimatePresence>

        {isPlaying && step > 1 && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/25 px-3.5 py-1 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            ⚡ ดึงไฟล์ประวัติและกิ่งหลักมายังเครื่องสำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "status") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0">
        
        {/* Scanning file cards */}
        <div className="flex items-center gap-4 relative">
          
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col items-center gap-1.5 shadow-xl relative overflow-hidden">
            <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-400 glow-red">
              <FileCode className="h-5.5 w-5.5" />
            </div>
            <div className="text-center font-mono text-[8px] text-slate-450 leading-tight">
              index.html <span className="text-red-450 font-bold block mt-0.5">(Modified)</span>
            </div>
            
            {/* Ping indicator */}
            <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-red-500 animate-ping" />
          </div>

          {/* Scanner sweeping bar */}
          {isPlaying && (
            <motion.div 
              animate={{ left: ["-10%", "110%", "-10%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 shadow-[0_0_8px_rgb(99,102,241)] z-10"
            />
          )}

          <div className="h-0.5 w-[50px] border-t border-dashed border-slate-800 relative" />

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col items-center gap-1.5 shadow-xl relative overflow-hidden">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <FileCode className="h-5.5 w-5.5" />
            </div>
            <div className="text-center font-mono text-[8px] text-slate-455 leading-tight">
              app.jsx <span className="text-orange-455 font-bold block mt-0.5">(Untracked)</span>
            </div>
            
            {/* Pulsing indicator */}
            <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-orange-455 animate-pulse" />
          </div>

        </div>

        <motion.div 
          animate={isPlaying ? { scale: [1, 1.01, 1] } : {}}
          className="rounded-lg border border-white/10 bg-[#090A14] p-3 w-full max-w-xs font-mono text-[9px] text-left text-slate-355 shadow-xl"
        >
          <div className="text-indigo-400 font-bold border-b border-white/5 pb-1 mb-1.5 flex items-center gap-1">
            <Terminal className="h-3 w-3" /> status log
          </div>
          <div>On branch <span className="text-indigo-455 font-bold">main</span></div>
          <div className="text-red-405 font-bold mt-1">Changes not staged:</div>
          <div className="pl-2 text-red-400/90 leading-none">modified: index.html</div>
          <div className="text-orange-405 font-bold mt-1">Untracked files:</div>
          <div className="pl-2 text-orange-455/90 leading-none">app.jsx</div>
        </motion.div>
      </div>
    );
  }

  if (type === "add") {
    const file = params.file || ".";
    return (
      <div className="flex-1 flex items-center justify-around relative text-white min-h-0">
        
        {/* Working Directory */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-3 w-[125px] h-[155px] flex flex-col items-center justify-between shadow-xl">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Working Dir</div>
          
          <AnimatePresence>
            {(step === 0 || !isPlaying) && (
              <motion.div
                layoutId="add-file"
                exit={{ scale: 0.6, opacity: 0, y: 35, rotate: 15 }}
                transition={{ duration: 0.8 }}
                className="h-14 w-11 rounded-lg bg-red-500/10 border border-red-500/35 flex flex-col items-center justify-center text-red-405 p-1 shadow-md glow-red relative"
              >
                <FileCode className="h-5 w-5" />
                <span className="text-[7px] truncate font-mono w-full text-center mt-1 font-bold">{file}</span>
                <span className="absolute -top-1.5 -right-1.5 text-[6px] font-bold px-1 py-0.5 rounded bg-red-500 text-white">M</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div />
        </div>

        {/* flow line */}
        <div className="flex-1 h-0.5 border-t border-dashed border-white/10 mx-2" />

        {/* Staging Area Box */}
        <div className="rounded-xl border-2 border-indigo-500/35 bg-indigo-500/5 p-3 w-[125px] h-[155px] flex flex-col items-center justify-between shadow-inner relative">
          <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Staging Area</div>
          
          <AnimatePresence>
            {isPlaying && step > 0 && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0, y: -35, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                layoutId="add-file"
                className="h-14 w-11 rounded-lg bg-emerald-500/10 border border-emerald-500/35 flex flex-col items-center justify-center text-emerald-400 p-1 shadow-lg glow-emerald relative"
              >
                <FileCode className="h-5 w-5" />
                <span className="text-[7px] truncate font-mono w-full text-center mt-1 font-bold">{file}</span>
                <span className="absolute -top-1.5 -right-1.5 text-[6px] font-bold px-1 py-0.5 rounded bg-emerald-500 text-white">A</span>
                
                {/* burst ripple effect */}
                <motion.span 
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [1, 1.8, 0], opacity: [1, 0.7, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-lg border border-emerald-400 shadow-[0_0_10px_rgba(52,199,89,0.6)]"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div />
        </div>

        {isPlaying && step > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-emerald-400 font-bold"
          >
            ✓ สเตจไฟล์เข้าด่านพักของ Staging Area สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "diff") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-2 text-white min-h-0">
        <div className="rounded-lg bg-[#0C0E1A] p-4.5 w-[260px] font-mono text-[8.5px] text-left border border-white/10 shadow-lg space-y-1 leading-relaxed">
          <div className="text-slate-500 font-bold">diff --git a/index.html b/index.html</div>
          <div className="text-slate-500">--- a/index.html</div>
          <div className="text-slate-500">+++ b/index.html</div>
          {isPlaying && step > 1 ? (
            <div className="space-y-0.5 mt-1">
              <span className="text-red-400 bg-red-950/30 block w-full px-1.5 rounded">- &lt;p&gt;Hello World&lt;/p&gt;</span>
              <span className="text-emerald-400 bg-emerald-950/30 block w-full px-1.5 rounded">+ &lt;p&gt;Hello GitLab Simulator&lt;/p&gt;</span>
              <span className="text-emerald-400 bg-emerald-950/30 block w-full px-1.5 rounded">+ &lt;button&gt;Click me&lt;/button&gt;</span>
            </div>
          ) : (
            <div className="text-slate-500 italic text-[8px] py-2 text-center animate-pulse">กำลังสแกนความเปลี่ยนแปลง...</div>
          )}
        </div>
      </div>
    );
  }

  if (type === "commit") {
    return (
      <div className="flex-1 flex items-center justify-around relative text-white min-h-0">
        
        {/* Staging Area */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-3 w-[125px] h-[155px] flex flex-col items-center justify-between shadow-xl">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Staging</div>
          <AnimatePresence>
            {(step === 0 || !isPlaying) && (
              <motion.div 
                layoutId="commit-circle"
                exit={{ scale: 0.2, y: 55, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.8 }}
                className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400 animate-pulse shadow-lg glow-emerald"
              >
                <FileCode className="h-5.5 w-5.5 animate-bounce" />
              </motion.div>
            )}
          </AnimatePresence>
          <div />
        </div>

        {/* pipeline */}
        <div className="flex-1 h-0.5 border-t border-dashed border-white/10 mx-2" />

        {/* Local database timeline graph */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-3 w-[190px] h-[155px] flex flex-col items-center justify-between relative overflow-hidden shadow-xl">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest z-10">Local Repository</div>
          
          <motion.div 
            animate={isPlaying && step > 0 ? { scale: [1, 1.04, 0.97, 1] } : {}}
            transition={{ duration: 0.8, type: "spring", stiffness: 350, damping: 15 }}
            className="flex items-center gap-2 mt-4 z-10"
          >
            {/* Old Commit Node */}
            <div className="h-8.5 w-8.5 rounded-full bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-[7.5px] font-mono font-bold text-slate-400 shadow-sm relative select-none">
              <span>commit</span>
              <span className="text-[6.5px] text-slate-550">a1d9c</span>
              <div className="absolute left-[34px] w-3 h-0.5 bg-slate-700" />
            </div>
            
            {/* New Commit Node */}
            <AnimatePresence>
              {isPlaying && step > 0 && (
                <motion.div 
                  initial={{ scale: 0.1, x: -35, opacity: 0 }}
                  animate={{ scale: 1, x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                  layoutId="commit-circle"
                  className="h-10 w-10 rounded-full bg-indigo-650 border border-indigo-400 flex flex-col items-center justify-center shadow-lg relative glow-indigo"
                >
                  <span className="text-[7.5px] font-bold text-indigo-200">COMMIT</span>
                  <span className="text-[6.5px] font-mono text-white font-bold leading-none">f8e5f</span>
                  <span className="absolute inset-0 rounded-full border border-indigo-450 animate-ping opacity-30" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="w-full text-center truncate text-[7.5px] font-mono text-indigo-400 z-10 font-bold px-2">
            {isPlaying && step > 0 ? `Message: "${params.message}"` : "รอสร้างประวัติ..."}
          </div>
        </div>

        {isPlaying && step > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            ✓ บันทึก Commit [f8e5f] และประทับข้อความลงประวัติสำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "checkout_file") {
    return (
      <div className="flex-1 flex items-center justify-center relative text-white min-h-0">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 w-[160px] h-[110px] flex flex-col items-center justify-center relative shadow-lg">
          <FileCode className="h-8 w-8 text-indigo-400" />
          <span className="text-[9.5px] font-mono font-bold text-slate-300 mt-2">{params.file || "index.html"}</span>
          
          <AnimatePresence>
            {isPlaying && step > 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold text-emerald-400 backdrop-blur-sm"
              >
                <span>✓ REVERTED</span>
                <span className="text-[7.5px] text-emerald-555 mt-1 font-mono font-medium">(Clean state)</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (type === "branch_list") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-3 text-white min-h-0">
        <div className="rounded-xl border border-white/10 p-3.5 w-[210px] font-mono text-[9px] text-left shadow-lg space-y-1.5 bg-[#0C0E1A]">
          <div className="text-indigo-400 font-bold border-b border-white/5 pb-1 flex items-center gap-1 select-none">
            <GitBranch className="h-3 w-3" /> git branch -a
          </div>
          <div className="space-y-1 text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span>*</span> <span>main</span>
            </div>
            <div className="pl-3.5 text-slate-400">feature/auth-page</div>
            <div className="pl-3.5 text-slate-500 font-semibold">remotes/origin/main</div>
            <div className="pl-3.5 text-slate-500 font-semibold">remotes/origin/feature/auth-page</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "checkout_branch") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0">
        <div className="w-full max-w-xs h-[175px] border border-white/10 rounded-xl bg-white/5 p-4 flex flex-col justify-around relative shadow-xl">
          
          <div className="flex items-center gap-4 pl-4 relative">
            <span className="text-[9px] font-bold text-slate-400 font-mono w-12">main</span>
            <div className="h-1.5 bg-slate-700 flex-1 relative flex items-center rounded-full">
              <div className="absolute left-[30px] h-3 w-3 rounded-full bg-slate-605 border border-slate-800" />
              <div className="absolute left-[100px] h-3 w-3 rounded-full bg-slate-605 border border-slate-800" />
              
              {/* HEAD pointer */}
              {(!isPlaying || step === 0) && (
                <motion.div 
                  layoutId="branch-pointer"
                  className="absolute left-[100px] h-6.5 w-6.5 rounded-full border-2 border-indigo-400 bg-indigo-500/30 flex items-center justify-center"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-405 animate-ping" />
                </motion.div>
              )}
            </div>
          </div>

          {/* branch path */}
          {isPlaying && (
            <div className="absolute left-[122px] top-[71px] h-[36px] w-12 border-l-2 border-b-2 border-dashed border-indigo-500/50 rounded-bl-lg" />
          )}

          <div className="flex items-center gap-4 pl-4 relative">
            <span className="text-[9px] font-bold text-indigo-400 font-mono w-12 truncate">{params.branch || "feature"}</span>
            <div className="h-1.5 bg-indigo-500/15 flex-1 relative flex items-center rounded-full">
              
              {isPlaying && step > 0 && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5 }}
                  className="absolute left-0 h-1.5 bg-indigo-500 rounded-full"
                />
              )}

              {isPlaying && step > 1 && (
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute left-[80px] h-3.5 w-3.5 rounded-full bg-indigo-500 border border-indigo-300 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                />
              )}

              {/* Head Pointer Swapped */}
              {isPlaying && step > 1 && (
                <motion.div 
                  layoutId="branch-pointer"
                  className="absolute left-[80px] h-6.5 w-6.5 rounded-full border-2 border-indigo-400 bg-indigo-500/30 flex items-center justify-center"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                </motion.div>
              )}
            </div>
          </div>

        </div>

        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            ✓ สลับสาขาทำงาน HEAD → กิ่งใหม่ "{params.branch}" สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "merge") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0">
        <div className="w-full max-w-xs h-[150px] border border-white/10 rounded-xl bg-white/5 p-4 flex flex-col justify-around relative shadow-lg">
          <div className="flex items-center justify-center gap-1.5 mt-2">
            
            {/* Main branch circle */}
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-[7px] text-slate-405 font-bold relative select-none">
              <span>main</span>
              <span className="text-[6px] text-slate-500">f8e5f</span>
              
              {isPlaying && step > 1 && (
                <motion.div 
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center text-[6px] text-white font-bold shadow-md glow-emerald animate-bounce"
                >
                  MRG
                </motion.div>
              )}
            </div>

            {/* Merge connection line */}
            <div className="w-[50px] h-0.5 border-t border-dashed border-slate-700 relative">
              {isPlaying && step > 0 && (
                <motion.div 
                  initial={{ left: 0 }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.2 }}
                  className="absolute h-2 w-2 rounded-full bg-indigo-400 -top-[3.5px] shadow-[0_0_8px_rgb(99,102,241)]"
                />
              )}
            </div>

            {/* Feature branch circle */}
            <motion.div 
              className="h-9 w-9 rounded-full bg-indigo-950/40 border border-indigo-500/30 flex flex-col items-center justify-center text-[7px] text-indigo-400 font-bold relative select-none"
            >
              <span>{params.branch ? params.branch.substring(0, 7) : "feature"}</span>
              <span className="text-[6px] text-indigo-555">c3a4f</span>
            </motion.div>

          </div>
        </div>
        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            ✓ รวมสาขา "{params.branch || "feature"}" เข้าสู่กิ่ง main สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "rebase") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0">
        <div className="w-full max-w-xs h-[160px] border border-white/10 rounded-xl bg-white/5 p-4 flex flex-col justify-around relative shadow-lg">
          <div className="flex flex-col gap-3.5 pl-6 relative">
            
            {/* Line of main */}
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] text-slate-400 font-bold w-10">main</span>
              <div className="flex items-center gap-1.5">
                <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[6px] text-slate-400 font-bold">c1</div>
                <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[6px] text-slate-400 font-bold">c2</div>
                
                {isPlaying && step > 1 && (
                  <motion.div
                    initial={{ scale: 0.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-6.5 w-6.5 rounded-full bg-indigo-650 border border-indigo-400 flex items-center justify-center text-[6px] text-white font-bold shadow-md glow-indigo"
                  >
                    c3*
                  </motion.div>
                )}
              </div>
            </div>

            {/* Line of feature */}
            {(!isPlaying || step <= 1) && (
              <div className="flex items-center gap-2">
                <span className="text-[7.5px] text-indigo-405 font-bold w-10 truncate">{params.branch || "feature"}</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-[6px] text-indigo-400 font-bold relative">
                    c3
                    {isPlaying && step === 1 && (
                      <motion.span 
                        animate={{ y: -30, opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 rounded-full border border-indigo-400"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            ✓ ดึงกิ่งคอมมิตขึ้นไป Rebase บนหัวกิ่ง "{params.branch || "main"}" สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "push" || type === "pull") {
    const isPush = type === "push";
    return (
      <div className="flex-1 flex items-center justify-around relative text-white min-h-0">
        
        {/* Local Machine */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 flex flex-col items-center shadow-xl">
            <Laptop className="h-8 w-8 text-slate-355" />
            <div className="flex gap-1.5 mt-2.5">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] font-mono text-slate-400 font-bold">c1</span>
              <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-indigo">c2</span>
              {isPlaying && !isPush && step > 1 && (
                <motion.span 
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-4.5 w-4.5 rounded-full bg-emerald-600 border border-emerald-500 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-emerald">c3</motion.span>
              )}
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400">Local Machine</span>
        </div>

        {/* pipe beam */}
        <div className="flex-1 h-1.5 bg-white/10 rounded-full mx-4 relative overflow-hidden max-w-[150px] border border-white/5">
          {isPlaying && (
            <>
              <motion.div
                initial={isPush ? { left: "-40px" } : { right: "-45px" }}
                animate={isPush ? { left: "100%" } : { right: "100%" }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-[40px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
              />
              {/* Flying Commit Packet */}
              <motion.div
                initial={isPush ? { left: "0%" } : { left: "100%" }}
                animate={isPush ? { left: "100%" } : { left: "0%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-2.5 w-2.5 rounded-full bg-indigo-400 border border-white shadow-[0_0_8px_rgba(99,102,241,0.8)] -top-[2px]"
              />
            </>
          )}
        </div>

        {/* Server GitLab */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-3 flex flex-col items-center shadow-xl relative">
            <Server className="h-8 w-8 text-indigo-555 animate-pulse" />
            <div className="flex gap-1.5 mt-2.5">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] font-mono text-slate-400 font-bold">c1</span>
              {isPush ? (
                isPlaying && step > 1 ? (
                  <motion.span 
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-4.5 w-4.5 rounded-full bg-indigo-650 border border-indigo-500 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-indigo"
                  >
                    c2
                  </motion.span>
                ) : (
                  <span className="h-4.5 w-4.5 rounded-full bg-slate-900 border border-slate-850 flex items-center justify-center text-[7px] font-mono text-slate-700 font-bold">c2</span>
                )
              ) : (
                <>
                  <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center text-[7px] font-mono text-white font-bold">c2</span>
                  <span className="h-4.5 w-4.5 rounded-full bg-emerald-600 border border-emerald-500 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-emerald">c3</span>
                </>
              )}
            </div>
            
            {/* Glowing active light */}
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-400 indicator-pulse" />
          </div>
          <span className="text-[9px] font-bold text-indigo-400">GitLab Cloud (origin)</span>
        </div>

        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            {isPush ? "🚀 ดันขึ้นเซิร์ฟเวอร์บนกิ่ง " : "📥 ดึงอัปเดตงานเพื่อนมารวมบนกิ่ง "} [{params.branch || "main"}] สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "stash") {
    return (
      <div className="flex-1 flex items-center justify-around relative text-white min-h-0">
        
        {/* Working directory status */}
        <div className="rounded-xl border border-white/15 bg-white/5 p-3 w-[125px] h-[155px] flex flex-col items-center justify-between shadow-xl">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Working Dir</div>
          
          <AnimatePresence>
            {(!isPlaying || step === 0 || step === 3) ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ y: 90, scale: 0.4, opacity: 0, rotate: 30 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                layoutId="stash-pack"
                className="h-14 w-12 rounded-lg bg-orange-500/10 border border-orange-500/35 flex flex-col items-center justify-center text-orange-400 p-1 shadow-md glow-red relative"
              >
                <FileCode className="h-5 w-5" />
                <span className="text-[8px] font-mono leading-none mt-1 font-bold">stash_code</span>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9px] text-emerald-400 font-extrabold flex items-center gap-1 mt-6"
              >
                ✓ CLEAN
              </motion.div>
            )}
          </AnimatePresence>
          <div />
        </div>

        {/* Action arrow */}
        <div className="flex-1 h-0.5 border-t border-dashed border-white/10 mx-2" />

        {/* Stash Safe Box */}
        <div className="rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-3 w-[135px] h-[155px] flex flex-col items-center justify-between relative shadow-inner">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Git Stash Safe</div>
          
          <AnimatePresence>
            {isPlaying && step > 0 && step < 3 && (
              <motion.div
                initial={{ y: -90, scale: 0.4, opacity: 0, rotate: -30 }}
                animate={{ y: 0, scale: 1, opacity: 1, rotate: 0 }}
                exit={{ y: -90, scale: 0.4, opacity: 0, rotate: -30 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                layoutId="stash-pack"
                className="h-12 w-10 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-400 p-1 shadow-lg relative"
              >
                <Database className="h-4 w-4 text-indigo-400 animate-pulse" />
                <span className="text-[7.5px] font-mono mt-0.5 font-bold">stash@{`{0}`}</span>
                <span className="absolute top-1.5 right-1.5 text-[7px]">🔒</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div />
        </div>

        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            {step === 0 && "เตรียมคัดแยกไฟล์ลงลิ้นชัก..."}
            {step === 1 && "📥 ซ่อนงานปัจจุบันสำเร็จ! (Working directory ว่างสะอาด)"}
            {step === 2 && "🔄 กำลังกู้ไฟล์คืนด้วย git stash pop..."}
            {step === 3 && "📤 กู้คืนไฟล์งานล่าสุดกลับมารวมที่เดิมสำเร็จ!"}
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "tag_create") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0">
        <div className="w-full max-w-xs h-[150px] border border-white/10 rounded-xl bg-white/5 p-4 flex flex-col justify-around relative shadow-lg">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">Local Commit Timeline</div>
          <div className="flex items-center justify-center gap-3 mt-2 relative">
            
            {/* Commit 1 */}
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-[7px] text-slate-450 font-bold">
              <span>c1</span>
              <span className="text-[5.5px] text-slate-500">a1d9c</span>
            </div>
            
            <div className="w-4 h-0.5 bg-slate-700" />
            
            {/* Commit 2 (Target commit to tag) */}
            <div className="h-9 w-9 rounded-full bg-indigo-650 border border-indigo-500 flex flex-col items-center justify-center text-[7.5px] text-white font-bold relative shadow-lg glow-indigo">
              <span>c2</span>
              <span className="text-[6px] text-indigo-300">f8e5f</span>
              
              {/* Floating Tag Pinning Animation */}
              {isPlaying && step > 1 && (
                <motion.div
                  initial={{ scale: 0.1, y: -25, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute -bottom-5 left-[3px] bg-amber-500 text-slate-950 font-sans font-black text-[7.5px] px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(245,158,11,0.6)] flex items-center gap-0.5 border border-amber-300 whitespace-nowrap"
                >
                  <span>🏷️</span>
                  <span>{params.version || "v1.0.0"}</span>
                </motion.div>
              )}
            </div>

          </div>
        </div>
        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            ✓ สร้างป้ายกำกับ "{params.version}" ผูกติดคอมมิต [f8e5f] สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "tag_push") {
    return (
      <div className="flex-1 flex items-center justify-around relative text-white min-h-0">
        
        {/* Local computer with tagged commit */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-white/20 bg-white/10 p-3 flex flex-col items-center shadow-xl relative">
            <Laptop className="h-8 w-8 text-slate-355" />
            <div className="h-5.5 w-5.5 rounded-full bg-indigo-600 flex items-center justify-center text-[7px] font-bold mt-2 relative">
              c2
              
              {/* Tag icon */}
              {(!isPlaying || step === 0) && (
                <motion.div 
                  layoutId="flying-tag"
                  className="absolute -bottom-3 bg-amber-500 text-slate-950 text-[6.5px] px-1 py-0.5 rounded font-black border border-amber-300 shadow-sm whitespace-nowrap"
                >
                  {params.version || "v1.0.0"}
                </motion.div>
              )}
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400">Local Machine</span>
        </div>

        {/* pipe beam */}
        <div className="flex-1 h-1.5 bg-white/10 rounded-full mx-4 relative max-w-[150px]">
          {isPlaying && step > 0 && step < 2 && (
            <motion.div
              layoutId="flying-tag"
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute -top-2 bg-amber-500 text-slate-950 text-[6.5px] px-1 py-0.5 rounded font-black border border-amber-300 shadow-md whitespace-nowrap"
            >
              {params.version || "v1.0.0"}
            </motion.div>
          )}
        </div>

        {/* Server GitLab with tag landing */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-slate-800 bg-[#111827] p-3 flex flex-col items-center shadow-xl relative">
            <Server className="h-8 w-8 text-indigo-555 animate-pulse" />
            <div className="h-5.5 w-5.5 rounded-full bg-indigo-600 flex items-center justify-center text-[7px] font-bold mt-2 relative">
              c2
              
              {isPlaying && step >= 2 && (
                <motion.div 
                  layoutId="flying-tag"
                  initial={{ scale: 0.2 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-3 bg-amber-500 text-slate-950 text-[6.5px] px-1 py-0.5 rounded font-black border border-amber-300 shadow-md glow-amber whitespace-nowrap"
                >
                  {params.version || "v1.0.0"}
                </motion.div>
              )}
            </div>
          </div>
          <span className="text-[9px] font-bold text-indigo-405">GitLab Server</span>
        </div>

        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[9px] text-indigo-405 font-bold"
          >
            🚀 ดันส่งป้ายกำกับ "{params.version}" สู่เซิร์ฟเวอร์ GitLab สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center text-white/50 text-sm">
      ไม่มีข้อมูลจำลอง
    </div>
  );
}
