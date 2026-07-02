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
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  FileText,
  Lock,
  ExternalLink,
  CheckSquare,
  Square,
  X
} from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
                colorClass = "text-fuchsia-455 font-extrabold";
              } else if (["config", "init", "clone", "status", "add", "diff", "commit", "checkout", "branch", "merge", "rebase", "push", "pull", "stash", "pop", "tag"].includes(token)) {
                colorClass = "text-sky-400 font-bold";
              } else if (token.startsWith("-") || token.startsWith("--")) {
                colorClass = "text-amber-400 font-medium";
              } else if (token.startsWith('"') || token.endsWith('"') || token.startsWith("'") || token.endsWith("'")) {
                colorClass = "text-emerald-455";
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
              let lineClass = "text-slate-450";
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
      "เป็นจุดเริ่มต้นในการทำงานของ Git บนเครื่องของตนเอง",
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


function GitBranchGraphVisualizer() {
  const [commits, setCommits] = React.useState([
    { id: "c0", label: "c0", hash: "a1d9c72", message: "initial commit", branch: "main", x: 45, y: 55, parents: [] },
    { id: "c1", label: "c1", hash: "f8e5f22", message: "add configuration", branch: "main", x: 115, y: 55, parents: ["c0"] }
  ]);
  const [branches, setBranches] = React.useState({
    main: "c1"
  });
  const [currentBranch, setCurrentBranch] = React.useState("main");
  const [branchTracks, setBranchTracks] = React.useState({
    main: 0
  });
  const [newBranchName, setNewBranchName] = React.useState("feature/auth");
  const [commitMessage, setCommitMessage] = React.useState("feat: add login page");
  const [selectedBranch, setSelectedBranch] = React.useState("");
  const [terminalInput, setTerminalInput] = React.useState("");
  const [consoleLogs, setConsoleLogs] = React.useState([
    "$ git init",
    "Initialized empty Git repository in C:/projects/my-web-app/.git/",
    "$ git commit -m 'initial commit'",
    "[main (root-commit) a1d9c72] initial commit",
    "$ git commit -m 'add configuration'",
    "[main f8e5f22] add configuration"
  ]);

  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  const getTrackColor = (trackIndex) => {
    const colors = ["#4F46E5", "#059669", "#D97706", "#DC2626", "#EC4899", "#7C3AED"];
    return colors[trackIndex % colors.length];
  };

  const generateHash = () => {
    return Math.random().toString(16).substring(2, 9);
  };

  const getHistory = (commitId) => {
    const list = [];
    const queue = [commitId];
    const visited = new Set();
    while (queue.length > 0) {
      const curr = queue.shift();
      if (!curr || visited.has(curr)) continue;
      visited.add(curr);
      list.push(curr);
      const commit = commits.find(c => c.id === curr);
      if (commit && commit.parents) {
        queue.push(...commit.parents);
      }
    }
    return list;
  };

  // Helper action: Commit
  const doCommit = (msg) => {
    const latestId = branches[currentBranch];
    const isDetached = !branches[currentBranch];
    const actualLatestId = isDetached ? currentBranch : latestId;
    const latestCommit = commits.find(c => c.id === actualLatestId);
    
    const newId = "c_" + generateHash();
    const hash = generateHash();
    const nextX = (latestCommit ? latestCommit.x : 45) + 70;
    
    let trackIdx = 0;
    let bName = currentBranch;
    if (isDetached) {
      trackIdx = 0;
      bName = "detached";
    } else {
      trackIdx = branchTracks[currentBranch] !== undefined ? branchTracks[currentBranch] : 0;
    }
    const nextY = 55 + trackIdx * 65;

    const newCommitObj = {
      id: newId,
      label: "c" + commits.filter(c => !c.orphaned).length,
      hash: hash,
      message: msg,
      branch: bName,
      x: nextX,
      y: nextY,
      parents: actualLatestId ? [actualLatestId] : []
    };

    setCommits(prev => [...prev, newCommitObj]);
    
    if (isDetached) {
      setCurrentBranch(newId);
      setConsoleLogs(prev => [
        ...prev,
        `[detached HEAD ${hash.substring(0, 7)}] ${msg}`,
        "Note: you are still in detached HEAD state."
      ]);
    } else {
      setBranches(prev => ({ ...prev, [currentBranch]: newId }));
      setConsoleLogs(prev => [
        ...prev,
        `[${currentBranch} ${hash.substring(0, 7)}] ${msg}`
      ]);
    }
  };

  // Helper action: Create Branch
  const doCreateBranch = (name, shouldCheckout = false) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (branches[trimmed]) {
      setConsoleLogs(prev => [...prev, `fatal: A branch named '${trimmed}' already exists.`]);
      return;
    }

    const currentLatestId = branches[currentBranch] || currentBranch;
    const existingTracks = Object.values(branchTracks);
    const nextTrack = existingTracks.length > 0 ? Math.max(...existingTracks) + 1 : 1;

    setBranches(prev => ({ ...prev, [trimmed]: currentLatestId }));
    setBranchTracks(prev => ({ ...prev, [trimmed]: nextTrack }));
    
    setConsoleLogs(prev => [
      ...prev,
      `Branch '${trimmed}' created at commit ${commits.find(c => c.id === currentLatestId)?.hash.substring(0, 7) || "root"}`
    ]);

    if (shouldCheckout) {
      setCurrentBranch(trimmed);
      setConsoleLogs(prev => [...prev, `Switched to branch '${trimmed}'`]);
    }
  };

  // Helper action: Checkout
  const doCheckout = (target) => {
    if (branches[target]) {
      setCurrentBranch(target);
      setConsoleLogs(prev => [...prev, `Switched to branch '${target}'`]);
    } else {
      const commit = commits.find(c => c.id === target || c.hash.startsWith(target));
      if (commit) {
        setCurrentBranch(commit.id);
        setConsoleLogs(prev => [
          ...prev,
          `Note: switching to '${target}' (detached HEAD)`,
          `You are in 'detached HEAD' state. HEAD is now at ${commit.hash.substring(0, 7)}...`
        ]);
      } else {
        setConsoleLogs(prev => [...prev, `error: pathspec '${target}' did not match any file(s) known to git`]);
      }
    }
  };

  // Helper action: Merge
  const doMerge = (target) => {
    if (target === currentBranch) {
      setConsoleLogs(prev => [...prev, "Already up to date."]);
      return;
    }
    
    const currentLatestId = branches[currentBranch];
    const targetLatestId = branches[target];
    if (!currentLatestId || !targetLatestId) {
      setConsoleLogs(prev => [...prev, "fatal: cannot merge in detached HEAD state or invalid branch."]);
      return;
    }

    const currentHistory = getHistory(currentLatestId);
    if (currentHistory.includes(targetLatestId)) {
      setConsoleLogs(prev => [...prev, "Already up to date."]);
      return;
    }

    const newId = "c_" + generateHash();
    const hash = generateHash();
    const currentLatest = commits.find(c => c.id === currentLatestId);
    const targetLatest = commits.find(c => c.id === targetLatestId);
    const nextX = Math.max(currentLatest.x, targetLatest.x) + 70;
    const trackIdx = branchTracks[currentBranch] !== undefined ? branchTracks[currentBranch] : 0;
    const nextY = 55 + trackIdx * 65;

    const newCommitObj = {
      id: newId,
      label: "c" + commits.filter(c => !c.orphaned).length,
      hash: hash,
      message: `Merge branch '${target}' into ${currentBranch}`,
      branch: currentBranch,
      x: nextX,
      y: nextY,
      parents: [currentLatestId, targetLatestId]
    };

    setCommits(prev => [...prev, newCommitObj]);
    setBranches(prev => ({ ...prev, [currentBranch]: newId }));
    setConsoleLogs(prev => [
      ...prev,
      "Merge made by the 'recursive' strategy.",
      `[${currentBranch} ${hash.substring(0, 7)}] Merge branch '${target}' into ${currentBranch}`
    ]);
  };

  // Helper action: Rebase
  const doRebase = (target) => {
    if (target === currentBranch) {
      setConsoleLogs(prev => [...prev, "Current branch is up to date."]);
      return;
    }
    
    const currentLatestId = branches[currentBranch];
    const targetLatestId = branches[target];
    if (!currentLatestId || !targetLatestId) {
      setConsoleLogs(prev => [...prev, "fatal: cannot rebase in detached HEAD state or invalid branch."]);
      return;
    }

    const currentHistory = getHistory(currentLatestId);
    const targetHistory = getHistory(targetLatestId);

    const ancestorId = currentHistory.find(id => targetHistory.includes(id));
    if (!ancestorId) {
      setConsoleLogs(prev => [...prev, "fatal: no common ancestor found for rebase."]);
      return;
    }

    const commitsToReplay = [];
    let curr = currentLatestId;
    while (curr && curr !== ancestorId) {
      const commit = commits.find(c => c.id === curr);
      if (!commit) break;
      if (!targetHistory.includes(curr)) {
        commitsToReplay.unshift(commit);
      }
      curr = commit.parents[0];
    }

    if (commitsToReplay.length === 0) {
      setConsoleLogs(prev => [...prev, `Current branch ${currentBranch} is up to date.`]);
      return;
    }

    const replayedIds = commitsToReplay.map(c => c.id);
    setCommits(prev => prev.map(c => {
      if (replayedIds.includes(c.id)) {
        return { ...c, orphaned: true };
      }
      return c;
    }));

    let parentId = targetLatestId;
    let lastX = commits.find(c => c.id === targetLatestId).x;
    const trackIdx = branchTracks[currentBranch] !== undefined ? branchTracks[currentBranch] : 1;
    const targetY = 55 + trackIdx * 65;

    const newReplayedCommits = [];
    const logEntries = ["First, rewinding head to replay your work on top of it..."];

    commitsToReplay.forEach((c) => {
      const newId = "c_" + generateHash();
      const hash = generateHash();
      lastX += 70;
      
      newReplayedCommits.push({
        id: newId,
        label: c.label + "'",
        hash: hash,
        message: c.message,
        branch: currentBranch,
        x: lastX,
        y: targetY,
        parents: [parentId]
      });

      logEntries.push(`Applying: ${c.message}`);
      parentId = newId;
    });

    setCommits(prev => [...prev, ...newReplayedCommits]);
    setBranches(prev => ({ ...prev, [currentBranch]: parentId }));
    setConsoleLogs(prev => [...prev, ...logEntries]);
  };

  // Helper action: Reset Hard
  const doResetHard = () => {
    setCommits([
      { id: "c0", label: "c0", hash: "a1d9c72", message: "initial commit", branch: "main", x: 45, y: 55, parents: [] },
      { id: "c1", label: "c1", hash: "f8e5f22", message: "add configuration", branch: "main", x: 115, y: 55, parents: ["c0"] }
    ]);
    setBranches({ main: "c1" });
    setCurrentBranch("main");
    setBranchTracks({ main: 0 });
    setSelectedBranch("");
    setConsoleLogs([
      "Initialized empty Git repository in C:/projects/my-web-app/.git/",
      "HEAD is now at f8e5f22 add configuration"
    ]);
  };

  // Terminal submission handler
  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const rawInput = terminalInput.trim();
    if (!rawInput) return;
    setTerminalInput("");

    // Add to console logs
    setConsoleLogs(prev => [...prev, `$ ${rawInput}`]);

    const cmd = rawInput.replace(/\s+/g, ' ');
    const parts = cmd.split(' ');

    if (parts[0] !== 'git' && cmd !== 'clear' && cmd !== 'clean') {
      setConsoleLogs(prev => [
        ...prev,
        `bash: command not found: ${parts[0]}`,
        "(คำสั่งต้องขึ้นต้นด้วย git หรือพิมพ์ clear)"
      ]);
      return;
    }

    if (cmd === 'clear' || cmd === 'clean') {
      setConsoleLogs([]);
      return;
    }

    const action = parts[1];
    
    if (action === 'commit') {
      let msg = "feat: work on progress";
      const mIdx = cmd.indexOf('-m ');
      if (mIdx !== -1) {
        const rest = cmd.substring(mIdx + 3).trim();
        if ((rest.startsWith('"') && rest.endsWith('"')) || (rest.startsWith("'") && rest.endsWith("'"))) {
          msg = rest.substring(1, rest.length - 1);
        } else {
          msg = rest;
        }
      }
      doCommit(msg);
    } 
    else if (action === 'branch') {
      const bName = parts[2];
      if (!bName) {
        setConsoleLogs(prev => [...prev, "fatal: branch name required", "usage: git branch <branch-name>"]);
        return;
      }
      doCreateBranch(bName);
    } 
    else if (action === 'checkout') {
      const arg = parts[2];
      if (!arg) {
        setConsoleLogs(prev => [...prev, "fatal: branch or commit hash required", "usage: git checkout <branch-name>"]);
        return;
      }
      if (arg === '-b') {
        const newBName = parts[3];
        if (!newBName) {
          setConsoleLogs(prev => [...prev, "fatal: branch name required", "usage: git checkout -b <branch-name>"]);
          return;
        }
        doCreateBranch(newBName, true);
      } else {
        doCheckout(arg);
      }
    }
    else if (action === 'switch') {
      const arg = parts[2];
      if (!arg) {
        setConsoleLogs(prev => [...prev, "fatal: branch name required", "usage: git switch <branch-name>"]);
        return;
      }
      if (arg === '-c') {
        const newBName = parts[3];
        if (!newBName) {
          setConsoleLogs(prev => [...prev, "fatal: branch name required", "usage: git switch -c <branch-name>"]);
          return;
        }
        doCreateBranch(newBName, true);
      } else {
        doCheckout(arg);
      }
    }
    else if (action === 'merge') {
      const target = parts[2];
      if (!target) {
        setConsoleLogs(prev => [...prev, "fatal: branch name required", "usage: git merge <branch-name>"]);
        return;
      }
      doMerge(target);
    }
    else if (action === 'rebase') {
      const target = parts[2];
      if (!target) {
        setConsoleLogs(prev => [...prev, "fatal: branch name required", "usage: git rebase <branch-name>"]);
        return;
      }
      doRebase(target);
    }
    else if (action === 'reset' && parts[2] === '--hard') {
      doResetHard();
    }
    else {
      setConsoleLogs(prev => [
        ...prev,
        `git: '${action}' is not a recognized git command.`,
        "คำสั่งที่รองรับ: commit, branch, checkout, switch, merge, rebase, reset --hard"
      ]);
    }
  };

  const getPath = (p, c) => {
    if (p.y === c.y) {
      return `M ${p.x} ${p.y} L ${c.x} ${c.y}`;
    } else {
      const midX = (p.x + c.x) / 2;
      return `M ${p.x} ${p.y} C ${midX} ${p.y}, ${midX} ${c.y}, ${c.x} ${c.y}`;
    }
  };

  const maxX = Math.max(...commits.map(c => c.x), 400);

  return (
    <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden text-slate-800">
      {/* Left panel: Actions */}
      <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-3 rounded-xl border border-white/50 bg-white/20 p-4 backdrop-blur-3xl shadow-xl overflow-y-auto no-scrollbar">
        <div className="text-[10px] font-black text-indigo-900 uppercase tracking-widest pb-1.5 border-b border-slate-300/10">
          ⚙️ Git Branching Commands
        </div>

        {/* Current branch status */}
        <div className="bg-slate-900/5 rounded-lg p-2.5 border border-slate-200/50 flex items-center justify-between">
          <div className="text-[9.5px] font-extrabold text-slate-700">Active Branch:</div>
          <span className="bg-emerald-500 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow">
            ★ {currentBranch}
          </span>
        </div>

        {/* Action: Commit */}
        <div className="space-y-1.5 bg-white/50 rounded-lg p-3 border border-slate-200/60 shadow-sm">
          <div className="text-[9.5px] font-extrabold text-slate-800">1. บันทึกคอมมิตประวัติงาน (Commit)</div>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded px-2 py-1 text-[9.5px] font-mono focus:outline-none focus:border-indigo-500"
            placeholder="Commit message..."
          />
          <button
            onClick={() => doCommit(commitMessage)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-[9.5px] py-1.5 rounded transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            git commit -m "{commitMessage.substring(0, 15)}..."
          </button>
        </div>

        {/* Action: Create Branch */}
        <div className="space-y-1.5 bg-white/50 rounded-lg p-3 border border-slate-200/60 shadow-sm">
          <div className="text-[9.5px] font-extrabold text-slate-800">2. แตกสาขากิ่งทำงานใหม่ (Create Branch)</div>
          <input
            type="text"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded px-2 py-1 text-[9.5px] font-mono focus:outline-none focus:border-indigo-500"
            placeholder="Branch name..."
          />
          <button
            onClick={() => doCreateBranch(newBranchName)}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-mono font-bold text-[9.5px] py-1.5 rounded transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            git branch {newBranchName}
          </button>
        </div>

        {/* Action: Switch Branch */}
        <div className="space-y-1.5 bg-white/50 rounded-lg p-3 border border-slate-200/60 shadow-sm">
          <div className="text-[9.5px] font-extrabold text-slate-800">3. สลับสาขากิ่งที่เลือก (Checkout)</div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded px-2 py-1 text-[9.5px] font-mono focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- เลือกกิ่งสาขา --</option>
            {Object.keys(branches).map(b => (
              <option key={b} value={b}>{b} {b === currentBranch ? "(active)" : ""}</option>
            ))}
          </select>
          <button
            onClick={() => doCheckout(selectedBranch)}
            disabled={!selectedBranch}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-350 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-mono font-bold text-[9.5px] py-1.5 rounded transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            git checkout {selectedBranch || "..."}
          </button>
        </div>

        {/* Action: Merge */}
        <div className="space-y-1.5 bg-white/50 rounded-lg p-3 border border-slate-200/60 shadow-sm">
          <div className="text-[9.5px] font-extrabold text-slate-800">4. รวมงานจากกิ่งอื่นเข้าสู่กิ่งหลัก (Merge)</div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded px-2 py-1 text-[9.5px] font-mono focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- เลือกกิ่งสาขา --</option>
            {Object.keys(branches).map(b => (
              <option key={b} value={b}>{b} {b === currentBranch ? "(active)" : ""}</option>
            ))}
          </select>
          <button
            onClick={() => doMerge(selectedBranch)}
            disabled={!selectedBranch || selectedBranch === currentBranch}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-350 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-mono font-bold text-[9.5px] py-1.5 rounded transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            git merge {selectedBranch || "..."}
          </button>
        </div>

        {/* Action: Rebase */}
        <div className="space-y-1.5 bg-white/50 rounded-lg p-3 border border-slate-200/60 shadow-sm">
          <div className="text-[9.5px] font-extrabold text-slate-800">5. ย้ายฐานประวัติต่อยอดกิ่ง (Rebase)</div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 rounded px-2 py-1 text-[9.5px] font-mono focus:outline-none focus:border-indigo-500"
          >
            <option value="">-- เลือกกิ่งสาขา --</option>
            {Object.keys(branches).map(b => (
              <option key={b} value={b}>{b} {b === currentBranch ? "(active)" : ""}</option>
            ))}
          </select>
          <button
            onClick={() => doRebase(selectedBranch)}
            disabled={!selectedBranch || selectedBranch === currentBranch}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-350 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-mono font-bold text-[9.5px] py-1.5 rounded transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            git rebase {selectedBranch || "..."}
          </button>
        </div>

        {/* Reset button */}
        <button
          onClick={doResetHard}
          className="mt-auto w-full bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-[9.5px] py-2 rounded transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" /> ล้างหน้าจอจำลอง (Reset)
        </button>
      </div>

      {/* Right panel: Visualization Canvas and Terminal */}
      <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-hidden">
        
        {/* SVG Graph Canvas Card */}
        <div className="rounded-xl flex-1 min-h-0 bg-white/20 border border-white/50 shadow-xl backdrop-blur-3xl p-5 flex flex-col justify-between overflow-hidden relative">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-300/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4.5 w-4.5 text-indigo-600" />
              <span className="text-xs font-mono font-black text-slate-800">Git History Graph</span>
            </div>
            <div className="text-[8.5px] font-mono text-indigo-650 bg-indigo-100/70 px-2.5 py-1 rounded border border-indigo-200/50 font-black">
              Interactive sandbox
            </div>
          </div>

          {/* SVG Scrollable Wrapper with LIGHT grid background */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden my-4 rounded-xl border border-slate-200/75 bg-slate-50/50 p-4 min-h-[240px] flex items-center relative">
            <svg width={maxX + 120} height="280" className="mx-auto relative z-10">
              <defs>
                {/* Dotted Grid Pattern */}
                <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="rgba(148, 163, 184, 0.15)" />
                </pattern>
                {/* Glow filter */}
                <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#dot-grid)" />

              {/* Connecting Lines */}
              {commits.map((c) => {
                return c.parents.map((pId) => {
                  const p = commits.find(x => x.id === pId);
                  if (!p) return null;
                  const trackIdx = branchTracks[c.branch] !== undefined ? branchTracks[c.branch] : 0;
                  const color = getTrackColor(trackIdx);
                  return (
                    <path
                      key={`${p.id}-${c.id}`}
                      d={getPath(p, c)}
                      stroke={color}
                      strokeWidth="3.5"
                      fill="none"
                      opacity={c.orphaned || p.orphaned ? 0.25 : 0.8}
                    />
                  );
                });
              })}

              {/* Commit Nodes & Labels */}
              {commits.map((c) => {
                const trackIdx = branchTracks[c.branch] !== undefined ? branchTracks[c.branch] : 0;
                const color = getTrackColor(trackIdx);
                const isCurrentHead = Object.values(branches).includes(c.id) || currentBranch === c.id;
                const heads = Object.entries(branches).filter(([name, id]) => id === c.id).map(([name]) => name);
                const isCurrentBranchHead = branches[currentBranch] === c.id || currentBranch === c.id;

                return (
                  <g key={c.id}>
                    {/* Pulsing HEAD ring */}
                    {isCurrentHead && isCurrentBranchHead && (
                      <motion.circle
                        cx={c.x}
                        cy={c.y}
                        r={18}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                        transition={{ duration: 1.3, repeat: Infinity }}
                      />
                    )}

                    {/* Commit circle node */}
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isCurrentBranchHead ? 11.5 : 8.5}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="cursor-pointer transition hover:scale-110 shadow-sm"
                      opacity={c.orphaned ? 0.3 : 1}
                      title={`Commit: ${c.hash.substring(0, 7)}\nMessage: ${c.message}\nBranch: ${c.branch}`}
                    />

                    {/* Commit index text inside node */}
                    <text
                      x={c.x}
                      y={c.y + 3.5}
                      textAnchor="middle"
                      fill="#FFF"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                      opacity={c.orphaned ? 0.3 : 1}
                    >
                      {c.label}
                    </text>

                    {/* Commit Hash underneath */}
                    <text
                      x={c.x}
                      y={c.y + 24}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                      opacity={c.orphaned ? 0.3 : 0.9}
                    >
                      {c.hash.substring(0, 7)}
                    </text>

                    {/* Branch Head labels stacked above commit node */}
                    {heads.map((bName, bIdx) => {
                      const isCurrent = bName === currentBranch;
                      return (
                        <g key={bName} transform={`translate(${c.x}, ${c.y - 18 - bIdx * 15})`}>
                          {/* Label Badge Background */}
                          <rect
                            x="-28"
                            y="-6.5"
                            width="56"
                            height="12"
                            rx="2"
                            fill={isCurrent ? "#10B981" : "#475569"}
                            stroke={isCurrent ? "#34C759" : "#64748B"}
                            strokeWidth="1.2"
                            className="shadow-sm"
                          />
                          {/* Label Text */}
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fill="#FFF"
                            fontSize="6.5"
                            fontFamily="sans-serif"
                            fontWeight="extrabold"
                            className="pointer-events-none select-none"
                          >
                            {isCurrent ? `★ ${bName}` : bName}
                          </text>
                        </g>
                      );
                    })}

                    {/* Show HEAD badge directly if detached head is pointing here */}
                    {!branches[currentBranch] && currentBranch === c.id && (
                      <g transform={`translate(${c.x}, ${c.y - 18})`}>
                        <rect x="-28" y="-6.5" width="56" height="12" rx="2" fill="#EF4444" stroke="#F87171" strokeWidth="1.2" className="shadow-sm" />
                        <text x="0" y="2" textAnchor="middle" fill="#FFF" fontSize="6.5" fontFamily="sans-serif" fontWeight="extrabold" className="pointer-events-none select-none">
                          ★ HEAD (det)
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[10px] text-slate-500 font-bold leading-normal select-none">
            💡 **คำแนะนำ:** คลิกปุ่มฝั่งซ้ายหรือพิมพ์คำสั่งตรงช่อง Console Terminal ด้านล่างเพื่อเริ่มแซนด์บ็อกซ์ได้ตามต้องการ!
          </div>
        </div>

        {/* Terminal Log Console */}
        <div className="h-[210px] rounded-xl border border-slate-200 bg-slate-900 p-4 flex flex-col shadow-lg flex-shrink-0 overflow-hidden relative">
          <div className="text-slate-350 font-mono font-bold text-[10px] border-b border-white/5 pb-2 mb-2 flex items-center justify-between select-none">
            <span className="flex items-center gap-1.5"><Terminal className="h-4 w-4 text-emerald-400" /> Git Console Terminal Prompt</span>
            <span className="text-[8px] text-emerald-450 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/30">Active Shell</span>
          </div>

          {/* Logs scroll area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-[10.5px] text-slate-200 space-y-1 pr-1.5 leading-relaxed text-left select-text">
            {consoleLogs.map((log, idx) => {
              let color = "text-slate-300";
              if (log.startsWith("$")) {
                color = "text-emerald-400 font-bold";
              } else if (log.includes("WIP") || log.includes("First,")) {
                color = "text-indigo-300";
              } else if (log.includes("commit") || log.includes("Switched")) {
                color = "text-sky-350";
              } else if (log.includes("fatal:") || log.includes("error:")) {
                color = "text-rose-400 font-semibold";
              }
              return (
                <div key={idx} className={color}>
                  {log}
                </div>
              );
            })}
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1.5 mt-2 border-t border-white/5 pt-2 flex-shrink-0">
            <span className="text-emerald-400 font-mono font-extrabold text-[11px] select-none animate-pulse">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent text-emerald-300 font-mono text-[10.5px] focus:outline-none placeholder-slate-650 font-bold"
              placeholder="พิมพ์คำสั่ง เช่น git commit -m 'feat: login' หรือ git checkout -b feature"
              autoFocus
            />
          </form>
        </div>

      </div>
    </div>
  );
}


export default function App() {
  const [viewMode, setViewMode] = useState("simulator"); // "simulator" or "guide"
  const [selectedCategory, setSelectedCategory] = useState("1. การตั้งค่า (Configuration)");
  const [selectedKey, setSelectedKey] = useState("config");
  const [copied, setCopied] = useState(false);
  const [params, setParams] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [triggerKey, setTriggerKey] = useState(0);

  // Guide specific states
  const [selectedGuidePhase, setSelectedGuidePhase] = useState("scenario"); // "scenario", 1-7, "errors", "quickstart"
  const [authMethod, setAuthMethod] = useState("ssh"); // "ssh" or "https"
  const [checkedGuideSteps, setCheckedGuideSteps] = useState({});
  const [copiedGuideText, setCopiedGuideText] = useState("");

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
    if (viewMode === "simulator") {
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
    }
  }, [selectedKey, triggerKey, viewMode]);

  const copyToClipboard = () => {
    const rawCommand = selectedCommand.command(params);
    navigator.clipboard.writeText(rawCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyGuideCommand = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedGuideText(key);
    setTimeout(() => setCopiedGuideText(""), 2000);
  };

  const toggleGuideStepCheck = (key) => {
    setCheckedGuideSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden p-6 md:p-7 lg:p-8 flex flex-col gap-4 text-slate-800 bg-[radial-gradient(circle_at_15%_15%,rgba(199,210,254,0.55),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(216,180,254,0.45),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(167,243,208,0.3),transparent_40%),linear-gradient(135deg,#f0f4fa,#fafcff_45%,#fff9fd)] font-sans">
      
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
          <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 bg-clip-text text-transparent flex items-center gap-2">
            GitLab Commands Visual Simulator ⚡
          </h1>
          <p className="text-[10px] text-slate-500 font-bold">บอร์ดแอนิเมชันคำสั่ง Git และคู่มือเริ่มต้นการอัปโหลดเชื่อมต่อไปยัง GitLab</p>
        </div>

        {/* View mode switcher */}
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white/50 p-1 shadow-sm">
            <button
              onClick={() => setViewMode("simulator")}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-[10px] font-black cursor-pointer transition-all duration-200 flex items-center gap-1.5",
                viewMode === "simulator"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Git Simulator</span>
            </button>
            <button
              onClick={() => setViewMode("graph")}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-[10px] font-black cursor-pointer transition-all duration-200 flex items-center gap-1.5",
                viewMode === "graph"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span>Git Branch Graph</span>
            </button>
            <button
              onClick={() => setViewMode("guide")}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-[10px] font-black cursor-pointer transition-all duration-200 flex items-center gap-1.5",
                viewMode === "guide"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>GitLab Setup Guide</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Workspace based on select view */}
      {viewMode === "simulator" ? (
        <>
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
                      
                      <div className="grid gap-1.5 text-[10px] text-slate-405 font-semibold pt-1">
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
        </>
      ) : viewMode === "graph" ? (
        <GitBranchGraphVisualizer />
      ) : (
        /* GitLab Setup Guide View Mode */
        <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 relative z-10 overflow-hidden">
          
          {/* Stepper Phase Menu (Left side) */}
          <aside className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-2 overflow-y-auto no-scrollbar rounded-xl border border-white/50 bg-white/20 p-3.5 backdrop-blur-3xl shadow-xl">
            <div className="text-[10px] font-black text-indigo-750 uppercase tracking-widest px-1 pb-2 border-b border-slate-350/10 select-none">
              📁 สารบัญคู่มือใช้งาน:
            </div>
            
            <div className="space-y-1 mt-1">
              <button
                onClick={() => setSelectedGuidePhase("scenario")}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2.5 text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-2",
                  selectedGuidePhase === "scenario"
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-white/50"
                )}
              >
                <span>🎯 Target Scenario</span>
              </button>

              {[1, 2, 3, 4, 5, 6, 7].map(phaseNum => (
                <button
                  key={phaseNum}
                  onClick={() => setSelectedGuidePhase(phaseNum)}
                  className={cn(
                    "w-full text-left rounded-lg px-3 py-2.5 text-[10px] font-extrabold cursor-pointer transition-all flex items-center justify-between",
                    selectedGuidePhase === phaseNum
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-605 hover:bg-white/50"
                  )}
                >
                  <span className="truncate">Phase {phaseNum}: {
                    phaseNum === 1 ? "Setup Git ในเครื่อง" :
                    phaseNum === 2 ? "Authentication" :
                    phaseNum === 3 ? "Setup Project" :
                    phaseNum === 4 ? "เชื่อม GitLab" :
                    phaseNum === 5 ? "Sync Repository" :
                    phaseNum === 6 ? "Commit & Push" : "Daily Workflow"
                  }</span>
                </button>
              ))}

              <button
                onClick={() => setSelectedGuidePhase("errors")}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2.5 text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-2",
                  selectedGuidePhase === "errors"
                    ? "bg-red-950 text-red-200 shadow-md border border-red-800"
                    : "text-red-500 hover:bg-red-50/50"
                )}
              >
                <span>❗ ERROR ที่พบบ่อย</span>
              </button>

              <button
                onClick={() => setSelectedGuidePhase("quickstart")}
                className={cn(
                  "w-full text-left rounded-lg px-3 py-2.5 text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-2",
                  selectedGuidePhase === "quickstart"
                    ? "bg-indigo-950 text-indigo-200 shadow-md border border-indigo-800"
                    : "text-indigo-600 hover:bg-indigo-50/50"
                )}
              >
                <span>🚀 QUICK START (ชุดรวดเร็ว)</span>
              </button>
            </div>
          </aside>

          {/* Guide Content details (Right side) */}
          <main className="flex-1 min-h-0 bg-white/20 border border-white/50 shadow-xl backdrop-blur-3xl p-5 rounded-xl flex flex-col gap-4 overflow-y-auto no-scrollbar relative">
            
            {/* 1. SCENARIO DETAILED PANEL */}
            {selectedGuidePhase === "scenario" && (
              <div className="space-y-4">
                <div className="border-b border-slate-300/10 pb-2">
                  <h2 className="text-sm font-black text-slate-900">🎯 GitLab & Git Starter Guide (Scenario)</h2>
                  <p className="text-[10px] text-slate-500 font-medium">คู่มืออ้างอิงและประยุกต์ใช้งานจากเอกสาร [gitlab_guide.md]</p>
                </div>
                <div className="bg-white/50 rounded-xl p-4.5 border border-white/80 space-y-3.5 shadow-sm">
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-indigo-500" /> สถานการณ์การเริ่มโครงการ (Project Conditions):
                  </h3>
                  <div className="grid gap-2.5 text-[11px] font-semibold text-slate-600 pl-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>มีโฟลเดอร์โปรเจกต์งานอยู่แล้วภายในเครื่องคอมพิวเตอร์</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>คลังโค้ดปลายทางบน GitLab Server ถูกจัดทำขึ้นมาแล้วและมีไฟล์ README</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>สามารถตั้งค่าเชื่อมส่งข้อมูลได้ทั้งโปรโตคอล SSH (แนะนำที่สุด) และ HTTPS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. DYNAMIC PHASES 1-7 */}
            {typeof selectedGuidePhase === "number" && (
              <div className="space-y-4">
                <div className="border-b border-slate-300/10 pb-2 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-slate-900">
                      {selectedGuidePhase === 1 && "✅ PHASE 1: Setup Git (ตั้งค่าระบบเครื่องครั้งแรก)"}
                      {selectedGuidePhase === 2 && "✅ PHASE 2: Setup Authentication (ยืนยันสิทธิ์เข้าเครื่อง)"}
                      {selectedGuidePhase === 3 && "✅ PHASE 3: Setup Project (เตรียมฐานข้อมูลในโปรเจกต์)"}
                      {selectedGuidePhase === 4 && "✅ PHASE 4: เชื่อม GitLab Remote"}
                      {selectedGuidePhase === 5 && "✅ PHASE 5: Sync Repo (ซิงค์ประสานงานดั้งเดิม)"}
                      {selectedGuidePhase === 6 && "✅ PHASE 6: Commit & Push (บันทึกนำส่งเวอร์ชันแรก)"}
                      {selectedGuidePhase === 7 && "✅ PHASE 7: Daily Workflow (วงจรอัปเดตงานประจำวัน)"}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-medium">ทำตามลำดับขั้นตอนย่อยด้านล่างเพื่อเชื่อมโปรเจกต์สมบูรณ์</p>
                  </div>
                </div>

                {/* Special Toggle Tabs for Phase 2 (SSH vs HTTPS switcher) */}
                {selectedGuidePhase === 2 && (
                  <div className="flex rounded-lg border border-slate-200 bg-white/40 p-1 w-fit mb-2 shadow-sm">
                    <button
                      onClick={() => setAuthMethod("ssh")}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-[9px] font-black cursor-pointer transition-all flex items-center gap-1",
                        authMethod === "ssh" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                      )}
                    >
                      <Lock className="h-3 w-3" /> วิธีที่ 1: SSH (แนะนำ ⭐)
                    </button>
                    <button
                      onClick={() => setAuthMethod("https")}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-[9px] font-black cursor-pointer transition-all flex items-center gap-1",
                        authMethod === "https" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-805"
                      )}
                    >
                      <Server className="h-3 w-3" /> วิธีที่ 2: HTTPS
                    </button>
                  </div>
                )}

                {/* Render Phase Steps */}
                <div className="space-y-4">
                  {getGuideStepsForPhase(selectedGuidePhase, authMethod).map((step, idx) => {
                    const stepKey = `phase-${selectedGuidePhase}-${authMethod}-${idx}`;
                    const isChecked = !!checkedGuideSteps[stepKey];
                    return (
                      <div 
                        key={idx} 
                        className={cn(
                          "rounded-xl p-4 border transition-all duration-200 shadow-sm flex flex-col gap-3",
                          isChecked 
                            ? "bg-emerald-50/30 border-emerald-305/70" 
                            : "bg-white/60 border-slate-200"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            {/* Checkbox Icon button */}
                            <button 
                              onClick={() => toggleGuideStepCheck(stepKey)}
                              className="text-slate-400 hover:text-indigo-600 mt-0.5 transition active:scale-90 cursor-pointer"
                            >
                              {isChecked ? (
                                <CheckSquare className="h-4.5 w-4.5 text-emerald-500" />
                              ) : (
                                <Square className="h-4.5 w-4.5" />
                              )}
                            </button>
                            <div>
                              <h4 className={cn("text-[11.5px] font-black tracking-tight", isChecked ? "text-slate-800 line-through opacity-70" : "text-slate-900")}>
                                {step.title}
                              </h4>
                              {step.desc && (
                                <p className="text-[10px] text-slate-500 font-bold mt-1 pl-0.5">{step.desc}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* If step has CLI command code, show terminal copy block */}
                        {step.command && (
                          <div className="rounded-lg bg-[#0C0E1A] border border-white/5 p-3 flex items-center justify-between text-white font-mono text-[10px] relative">
                            <span className="select-all overflow-x-auto whitespace-pre no-scrollbar flex-1 pr-4 leading-normal">{step.command}</span>
                            <button
                              onClick={() => copyGuideCommand(step.command, stepKey)}
                              className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white p-1 rounded border border-white/10 transition cursor-pointer"
                              title="คัดลอกโค้ดคำสั่ง"
                            >
                              {copiedGuideText === stepKey ? (
                                <Check className="h-3 w-3 text-emerald-450" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}

                        {/* Extra informational tip */}
                        {step.tip && (
                          <div className="text-[9.5px] text-slate-500 font-bold flex items-center gap-1.5 pl-1">
                            <Info className="h-3.5 w-3.5 text-indigo-505" />
                            <span>{step.tip}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. SOLVE ERRORS LIST */}
            {selectedGuidePhase === "errors" && (
              <div className="space-y-4">
                <div className="border-b border-slate-300/10 pb-2">
                  <h2 className="text-sm font-black text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="h-4.5 w-4.5 animate-bounce" /> ❗ ERROR ที่พบบ่อยและวิธีแก้ไข (Troubleshooting)
                  </h2>
                  <p className="text-[10px] text-slate-500 font-medium">รวมข้อผิดพลาดหลักขณะเชื่อมต่อเซิร์ฟเวอร์ และบรรทัดคำสั่งที่ช่วยแก้ปัญหา</p>
                </div>

                <div className="space-y-4.5">
                  {/* Error 1 */}
                  <div className="rounded-xl border border-red-200/50 bg-red-50/10 p-4 space-y-2.5">
                    <h3 className="text-xs font-black text-red-755">1. error: pathspec 'main' did not match any file(s) / no upstream branch</h3>
                    <p className="text-[10.5px] text-slate-600 font-bold pl-1">เกิดจากยังไม่เคยตั้งกิ่งหลักเริ่มต้นขึ้นเครื่อง หรือไม่ได้จับคู่กิ่งปลายทาง ให้รันคำสั่งแก้ไข:</p>
                    <div className="rounded-lg bg-[#0C0E1A] p-3 text-[10px] font-mono text-white flex items-center justify-between">
                      <span>git push -u origin main</span>
                      <button 
                        onClick={() => copyGuideCommand("git push -u origin main", "err-1")}
                        className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white p-1 rounded border border-white/10"
                      >
                        {copiedGuideText === "err-1" ? <Check className="h-3 w-3 text-emerald-450" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Error 2 */}
                  <div className="rounded-xl border border-red-200/50 bg-red-50/10 p-4 space-y-2.5">
                    <h3 className="text-xs font-black text-red-755">2. Fatal: SSL Certificate Problem (HTTPS SSL Error)</h3>
                    <p className="text-[10.5px] text-slate-600 font-bold pl-1">เกิดจากเชื่อมต่อ HTTPS แล้ว Certificate องค์กรไม่ได้รับการยืนยัน ให้รันยกเลิกตรวจสอบ SSL ชั่วคราว:</p>
                    <div className="rounded-lg bg-[#0C0E1A] p-3 text-[10px] font-mono text-white flex items-center justify-between">
                      <span>git config --global http.sslverify false</span>
                      <button 
                        onClick={() => copyGuideCommand("git config --global http.sslverify false", "err-2")}
                        className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white p-1 rounded border border-white/10"
                      >
                        {copiedGuideText === "err-2" ? <Check className="h-3 w-3 text-emerald-450" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Error 3 */}
                  <div className="rounded-xl border border-red-200/50 bg-red-50/10 p-4 space-y-2.5">
                    <h3 className="text-xs font-black text-red-755">3. Permission denied (publickey) via SSH</h3>
                    <p className="text-[10.5px] text-slate-600 font-bold pl-1">เกิดจากการเชื่อมต่อ SSH ไม่มีกุญแจที่ถูกต้องบนเซิร์ฟเวอร์ GitLab:</p>
                    <ul className="list-disc pl-5 text-[10px] text-slate-600 font-bold space-y-1">
                      <li>ตรวจสอบว่าพิมพ์สร้างคีย์ ed25519 หรือยัง</li>
                      <li>ตรวจสอบว่า Copy คีย์สาธารณะ `.pub` ไปบันทึกหน้าเว็บ GitLab SSH Keys แล้ว</li>
                      <li>รันคำสั่ง `ssh -T git@seagit.okla.seagate.com` เพื่อเช็คความคืบหน้าทดสอบ</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 4. QUICK STARTS */}
            {selectedGuidePhase === "quickstart" && (
              <div className="space-y-4">
                <div className="border-b border-slate-300/10 pb-2">
                  <h2 className="text-sm font-black text-indigo-900">🚀 QUICK START (ชุดรันด่วนรวดเดียวจบ)</h2>
                  <p className="text-[10px] text-slate-500 font-medium">สำหรับผู้ที่เข้าใจขั้นตอนแล้ว สามารถก๊อปปี้บล็อกชุดคำสั่งรวดเดียวไปปรับเปลี่ยน URL เพื่อรันได้ทันที</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* SSH Quick start */}
                  <div className="rounded-xl border border-indigo-200/50 bg-indigo-50/10 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black text-indigo-755 flex items-center gap-1">⭐ ชุดคำสั่งยิงยาว (SSH Mode)</h3>
                      <p className="text-[9.5px] text-slate-500 font-bold mt-1">คัดลอกรันเรียงแถวในโฟลเดอร์สำหรับ SSH:</p>
                      <pre className="text-[9.5px] font-mono bg-[#0C0E1A] text-slate-300 p-2.5 rounded border border-white/5 mt-2 text-left leading-relaxed">
{`git init
git remote add origin git@seagit.okla.seagate.com:web-gallery/webgdoc.git
git pull origin main --allow-unrelated-histories
git add .
git commit -m "init"
git branch -M main
git push -u origin main`}
                      </pre>
                    </div>
                    <button
                      onClick={() => copyGuideCommand(`git init\ngit remote add origin git@seagit.okla.seagate.com:web-gallery/webgdoc.git\ngit pull origin main --allow-unrelated-histories\ngit add .\ngit commit -m "init"\ngit branch -M main\ngit push -u origin main`, "quick-ssh")}
                      className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2 text-[10px] font-bold transition active:scale-97 cursor-pointer mt-1"
                    >
                      {copiedGuideText === "quick-ssh" ? "✓ คัดลอกสำเร็จ!" : "📋 คัดลอกชุดคำสั่ง SSH ทั้งหมด"}
                    </button>
                  </div>

                  {/* HTTPS Quick start */}
                  <div className="rounded-xl border border-indigo-200/50 bg-indigo-50/10 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-black text-indigo-755 flex items-center gap-1">ชุดคำสั่งยิงยาว (HTTPS Mode)</h3>
                      <p className="text-[9.5px] text-slate-500 font-bold mt-1">คัดลอกรันเรียงแถวในโฟลเดอร์สำหรับ HTTPS:</p>
                      <pre className="text-[9.5px] font-mono bg-[#0C0E1A] text-slate-300 p-2.5 rounded border border-white/5 mt-2 text-left leading-relaxed">
{`git init
git remote add origin https://seagit.okla.seagate.com/web-gallery/webgdoc.git
git config --global credential.helper manager
git pull origin main --allow-unrelated-histories
git add .
git commit -m "init"
git branch -M main
git push -u origin main`}
                      </pre>
                    </div>
                    <button
                      onClick={() => copyGuideCommand(`git init\ngit remote add origin https://seagit.okla.seagate.com/web-gallery/webgdoc.git\ngit config --global credential.helper manager\ngit pull origin main --allow-unrelated-histories\ngit add .\ngit commit -m "init"\ngit branch -M main\ngit push -u origin main`, "quick-https")}
                      className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2 text-[10px] font-bold transition active:scale-97 cursor-pointer mt-1"
                    >
                      {copiedGuideText === "quick-https" ? "✓ คัดลอกสำเร็จ!" : "📋 คัดลอกชุดคำสั่ง HTTPS ทั้งหมด"}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>
      )}

    </div>
  );
}

// 5. Visual Simulation Canvas render components
function AnimationSandbox({ type, isPlaying, step, params }) {
  
  if (type === "config") {
    const isConfigured = isPlaying && step > 1;
    
    return (
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-3 relative text-white min-h-0">
        
        {/* User Card */}
        <motion.div
          animate={{ 
            scale: isPlaying ? [1, 1.05, 0.98, 1] : 1, 
            rotate: isPlaying ? [0, 2, -2, 0] : 0,
            x: isConfigured ? 45 : 0
          }}
          transition={{ duration: 1.5, type: "spring", stiffness: 80, damping: 15 }}
          className="rounded-xl border border-white/15 bg-white/5 p-4.5 w-[170px] flex flex-col items-center gap-3 shadow-xl backdrop-blur-md relative flex-shrink-0"
        >
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center font-black text-xl shadow-lg border-2 border-white/35 relative">
            {params.name ? params.name.charAt(0) : "U"}
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-400 border-2 border-slate-955 indicator-pulse" />
          </div>
          <div className="text-center min-w-0 w-full space-y-0.5">
            <div className="text-[11px] font-extrabold truncate text-white">{params.name || "Username"}</div>
            <div className="text-[9px] text-slate-400 truncate">{params.email || "Email"}</div>
          </div>
        </motion.div>

        {/* Action arrow beam (Enlarged Progress Bar) */}
        <motion.div 
          animate={{ 
            opacity: isConfigured ? 0 : 1,
            scaleX: isConfigured ? 0.3 : 1
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="h-5 bg-white/5 rounded-full relative hidden md:block w-[120px] border border-white/5 overflow-hidden flex-shrink-0"
        >
          {isPlaying && (
            <>
              {/* Sliding energy dot */}
              <motion.div 
                initial={{ left: "-40px" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-full w-[40px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
              />
              {/* Flying config key icon */}
              <motion.div
                initial={{ left: "-20px", y: 0 }}
                animate={{ left: "100%", y: [2, -2, 2] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute text-xs select-none"
              >
                ⚙️
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Config File */}
        <motion.div
          animate={{ 
            scale: isConfigured ? [1, 1.03, 1] : 1, 
            borderColor: isConfigured ? ["rgba(255,255,255,0.15)", "rgba(52,199,89,0.4)", "rgba(255,255,255,0.15)"] : "rgba(255,255,255,0.15)",
            x: isConfigured ? -45 : 0
          }}
          transition={{ duration: 1.5, type: "spring", stiffness: 80, damping: 15 }}
          className="rounded-lg border border-white/15 bg-[#0C0E1A] p-4 w-[200px] font-mono text-[9px] space-y-2.5 text-left shadow-xl flex-shrink-0 relative overflow-hidden"
        >
          <div className="text-indigo-400 font-extrabold border-b border-white/5 pb-1 flex items-center gap-1 select-none">
            <FileCode className="h-3 w-3" /> ~/.gitconfig
          </div>
          <div className="space-y-0.5 text-slate-355 text-slate-350">
            <div className="text-slate-500 font-bold">[user]</div>
            <div className="flex gap-1.5 pl-3 items-center min-h-[1.2rem]">
              <span className="text-slate-500">name =</span>
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
                <span className="text-slate-500 italic">undefined</span>
              )}
            </div>
            <div className="flex gap-1.5 pl-3 items-center min-h-[1.2rem]">
              <span className="text-slate-500">email =</span>
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
                <span className="text-slate-500 italic">undefined</span>
              )}
            </div>
          </div>
        </motion.div>

        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full text-[9px] text-emerald-400 font-bold"
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
          <div className="text-slate-550 font-bold select-none">$ git status</div>
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
    const isCloned = isPlaying && step > 1;

    return (
      <div className="flex-1 flex items-center justify-center gap-3 relative text-white min-h-0">
        
        {/* GitLab Server */}
        <motion.div 
          animate={{ x: isCloned ? 75 : 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/30 p-3.5 shadow-xl flex flex-col gap-1.5 items-center justify-center relative">
            <Server className="h-10 w-10 text-indigo-500 animate-pulse" />
            <div className="flex gap-1 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 indicator-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            </div>
          </div>
          <div className="text-center font-bold text-[9px]">
            <div className="text-white">GitLab Server</div>
            <div className="text-indigo-400">web-app.git</div>
          </div>
        </motion.div>

        {/* Transfer pipeline with files flying (Expanded Pipeline Channel, hides on completion) */}
        <motion.div 
          animate={{ 
            opacity: isCloned ? 0 : 1,
            scaleX: isCloned ? 0.3 : 1
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex-1 h-5 bg-white/5 rounded-full mx-2 relative overflow-hidden max-w-[160px] border border-white/5 flex-shrink-0"
        >
          {isPlaying && !isCloned && (
            <>
              {/* Scanning light streak */}
              <motion.div
                initial={{ left: "-40px" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-[60px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
              />
              {/* Flying Files */}
              {["📁", "📄", "⚙️"].map((icon, idx) => (
                <motion.div
                  key={idx}
                  initial={{ left: "-20px", y: 0 }}
                  animate={{ left: "100%", y: [4, -4, 4], rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: idx * 0.4 }}
                  className="absolute text-sm select-none"
                >
                  {icon}
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        {/* Local laptop with file tree expansion */}
        <motion.div 
          animate={{ x: isCloned ? -75 : 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="flex flex-col items-center gap-2 relative"
        >
          <div className="rounded-xl bg-white/5 border border-white/15 p-3.5 shadow-xl relative">
            <Laptop className="h-9 w-9 text-slate-300" />
            
            {isPlaying && step > 1 && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-4 bg-indigo-400 rounded blur-sm"
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
              <div className="text-slate-400 font-normal">Empty Space</div>
            )}
          </div>
        </motion.div>

        {/* Directory popup file tree (Sibling positioned absolutely next to laptop in top-right) */}
        <AnimatePresence>
          {isPlaying && step > 1 && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.3, opacity: 0 }}
              className="absolute right-[12%] top-[10%] rounded-lg border border-white/10 bg-slate-900/90 p-2 font-mono text-[8px] space-y-1 shadow-2xl w-[90px] text-left z-20"
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
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/25 px-3.5 py-1.5 rounded-full text-[9px] text-indigo-400 font-bold"
          >
            ⚡ ดึงไฟล์ประวัติและกิ่งหลักมายังเครื่องสำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

    if (type === "status") {
    const isScanning = isPlaying && step < 2;

    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4.5 relative text-white min-h-0 select-none">
        
        {/* Radar Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
          <svg className="w-full h-full max-h-[130px]" viewBox="0 0 300 130">
            <circle cx="150" cy="65" r="25" fill="none" stroke="#6366F1" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="150" cy="65" r="55" fill="none" stroke="#6366F1" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="150" cy="65" r="85" fill="none" stroke="#6366F1" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Scanning file cards row */}
        <div className="flex items-center justify-center gap-5 relative z-10 w-full max-w-[280px]">
          
          {/* Scanning Sweeping Laser Line */}
          {isScanning && (
            <motion.div 
              animate={{ left: ["0%", "100%", "0%"] }}
              transition={{ duration: 2.6, repeat: 0, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-sky-400 to-indigo-500 shadow-[0_0_10px_rgb(56,189,248)] z-20 pointer-events-none"
            />
          )}

          {/* Left File: index.html (Modified) */}
          <motion.div
            animate={isScanning ? {
              scale: [1, 1.08, 1],
              borderColor: ["rgba(239,68,68,0.2)", "rgba(239,68,68,0.7)", "rgba(239,68,68,0.2)"],
              boxShadow: [
                "0 0 10px rgba(239,68,68,0.1)",
                "0 0 20px rgba(239,68,68,0.4)",
                "0 0 10px rgba(239,68,68,0.1)"
              ]
            } : {
              scale: 1,
              borderColor: "rgba(239,68,68,0.2)",
              boxShadow: "0 0 10px rgba(239,68,68,0.1)"
            }}
            transition={{ duration: 1.3, ease: "easeInOut" }}
            className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 flex flex-col items-center gap-1.5 shadow-md relative overflow-hidden w-[105px] h-[105px] justify-center flex-shrink-0"
          >
            <div className="h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 relative">
              <FileCode className="h-5.5 w-5.5" />
              {/* Scan Laser Reflection Line */}
              {isScanning && (
                <motion.div
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 1.3, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-red-400/35 shadow-sm"
                />
              )}
            </div>
            <div className="text-center font-mono text-[8px] text-slate-355 leading-tight">
              index.html <span className="text-red-400 font-bold block mt-0.5">(Modified)</span>
            </div>
            <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-red-500 animate-ping" />
          </motion.div>

          {/* Middle Connection Node */}
          <div className="h-0.5 w-8 border-t border-dashed border-slate-700/60 flex-shrink-0" />

          {/* Right File: app.jsx (Untracked) */}
          <motion.div
            animate={isScanning ? {
              scale: [1, 1.08, 1],
              borderColor: ["rgba(249,115,22,0.2)", "rgba(249,115,22,0.7)", "rgba(249,115,22,0.2)"],
              boxShadow: [
                "0 0 10px rgba(249,115,22,0.1)",
                "0 0 20px rgba(249,115,22,0.4)",
                "0 0 10px rgba(249,115,22,0.1)"
              ]
            } : {
              scale: 1,
              borderColor: "rgba(249,115,22,0.2)",
              boxShadow: "0 0 10px rgba(249,115,22,0.1)"
            }}
            transition={{ duration: 1.3, delay: 1.3, ease: "easeInOut" }}
            className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 flex flex-col items-center gap-1.5 shadow-md relative overflow-hidden w-[105px] h-[105px] justify-center flex-shrink-0"
          >
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 relative">
              <FileCode className="h-5.5 w-5.5" />
              {/* Scan Laser Reflection Line */}
              {isScanning && (
                <motion.div
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 1.3, delay: 1.3, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-orange-400/35 shadow-sm"
                />
              )}
            </div>
            <div className="text-center font-mono text-[8px] text-slate-350 leading-tight">
              app.jsx <span className="text-orange-400 font-bold block mt-0.5">(Untracked)</span>
            </div>
            <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-orange-500 animate-pulse" />
          </motion.div>

        </div>

        {/* Console status log */}
        <div className="rounded-lg border border-white/10 bg-[#090A14] p-3 w-full max-w-xs font-mono text-[9px] text-left text-slate-400 shadow-xl relative z-10">
          <div className="text-indigo-400 font-bold border-b border-white/5 pb-1 mb-1.5 flex items-center gap-1">
            <Terminal className="h-3 w-3" /> status log
          </div>
          
          <div className="space-y-0.5 leading-relaxed">
            {/* Line 1: always visible */}
            <div>On branch <span className="text-indigo-400 font-bold">main</span></div>
            
            {/* Line 2 & 3: stage unstaged changes */}
            {(!isPlaying || step >= 1) ? (
              <div className="text-red-400 font-bold mt-1">
                Changes not staged:
                <span className="block pl-2 text-red-400/90 font-normal">modified: index.html</span>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-red-400 font-bold mt-1"
              >
                Changes not staged:
                <span className="block pl-2 text-red-400/90 font-normal">modified: index.html</span>
              </motion.div>
            )}

            {/* Line 4 & 5: untracked files */}
            {(!isPlaying || step >= 2) ? (
              <div className="text-orange-400 font-bold mt-1">
                Untracked files:
                <span className="block pl-2 text-orange-400/90 font-normal">app.jsx</span>
              </div>
            ) : isPlaying && step === 1 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-orange-400 font-bold mt-1"
              >
                Untracked files:
                <span className="block pl-2 text-orange-400/90 font-normal">app.jsx</span>
              </motion.div>
            ) : (
              <div className="h-0" />
            )}
          </div>
        </div>

      </div>
    );
  }

    if (type === "add") {
    const file = params.file || ".";
    const isStaged = isPlaying && step > 0;
    
    return (
      <div className="flex-1 flex items-center justify-center gap-6 relative text-white min-h-0 select-none">
        
        {/* Working Directory Card */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4.5 w-[130px] h-[160px] flex flex-col justify-between items-center shadow-xl relative">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-1 w-full text-center">
            Working Dir
          </div>
          
          <div className="h-16 w-12 flex items-center justify-center relative">
            {!isStaged && (
              <motion.div
                layoutId="add-file-card"
                className="h-14 w-10 rounded-lg bg-red-500/10 border border-red-500/35 flex flex-col items-center justify-center text-red-400 p-1 shadow-md glow-red relative"
              >
                <FileCode className="h-5.5 w-5.5" />
                <span className="text-[7.5px] truncate font-mono w-full text-center mt-1 font-bold">{file}</span>
                <span className="absolute -top-1.5 -right-1.5 text-[6.5px] font-bold px-1.5 py-0.5 rounded bg-red-500 text-white font-mono shadow">M</span>
              </motion.div>
            )}
          </div>
          
          <div className="text-[8px] font-semibold text-red-400/80 flex items-center gap-1 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /> 1 modified
          </div>
        </div>

        {/* Conduit line with glowing pulse */}
        <div className="h-5 bg-white/5 rounded-full relative w-[80px] border border-white/5 overflow-hidden flex-shrink-0">
          {isPlaying && (
            <motion.div
              initial={{ left: "-40px" }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute h-full w-[40px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
            />
          )}
        </div>

        {/* Staging Area Card */}
        <div className="rounded-xl border-2 border-dashed border-indigo-500/25 bg-indigo-950/20 p-4.5 w-[130px] h-[160px] flex flex-col justify-between items-center shadow-inner relative overflow-hidden">
          <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest border-b border-white/5 pb-1 w-full text-center">
            Staging Area
          </div>
          
          <div className="h-16 w-12 flex items-center justify-center relative">
            {isStaged && (
              <motion.div
                layoutId="add-file-card"
                className="h-14 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/35 flex flex-col items-center justify-center text-emerald-400 p-1 shadow-lg glow-emerald relative"
              >
                <FileCode className="h-5.5 w-5.5" />
                <span className="text-[7.5px] truncate font-mono w-full text-center mt-1 font-bold">{file}</span>
                <span className="absolute -top-1.5 -right-1.5 text-[6.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white font-mono shadow">A</span>
                
                {/* burst ripple effect inside the file itself */}
                <motion.span 
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: [1, 1.8, 2.2], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 rounded-lg border-2 border-emerald-400 shadow-[0_0_10px_rgba(52,199,89,0.6)]"
                />
              </motion.div>
            )}
          </div>
          
          <div className="text-[8px] font-semibold text-emerald-400/80 flex items-center gap-1 select-none">
            <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${isStaged ? "animate-pulse" : ""}`} /> 
            {isStaged ? "1 staged" : "0 staged"}
          </div>

          {/* Shockwave ripple on the container */}
          {isStaged && (
            <motion.span 
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: [1, 1.6, 2], opacity: [1, 0.4, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 rounded-xl border border-emerald-400 shadow-[0_0_12px_rgba(52,199,89,0.4)] pointer-events-none"
            />
          )}
        </div>

        {/* Success message */}
        {isStaged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9.5px] text-emerald-400 font-bold"
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
    const isCommitted = isPlaying && step > 0;
    
    return (
      <div className="flex-1 flex items-center justify-center gap-6 relative text-white min-h-0 select-none">
        
        {/* Staging Area Card */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4.5 w-[130px] h-[160px] flex flex-col justify-between items-center shadow-xl relative">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-1 w-full text-center">
            Staging
          </div>
          
          <div className="h-16 w-12 flex items-center justify-center relative">
            {!isCommitted && (
              <motion.div
                layoutId="commit-node"
                className="h-14 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/35 flex flex-col items-center justify-center text-emerald-400 p-1 shadow-md glow-emerald relative z-10"
              >
                <FileCode className="h-5.5 w-5.5" />
                <span className="text-[7.5px] truncate font-mono w-full text-center mt-1 font-bold">index.html</span>
                <span className="absolute -top-1.5 -right-1.5 text-[6.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white font-mono shadow">A</span>
              </motion.div>
            )}
          </div>
          
          <div className="text-[8px] font-semibold text-emerald-400/80 flex items-center gap-1 select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> 1 staged
          </div>
        </div>

        {/* Conduit line with glowing pulse */}
        <div className="h-5 bg-white/5 rounded-full relative w-[60px] border border-white/5 overflow-hidden flex-shrink-0">
          {isPlaying && !isCommitted && (
            <motion.div
              initial={{ left: "-40px" }}
              animate={{ left: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute h-full w-[40px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
            />
          )}
        </div>

        {/* Local Repository Card */}
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 w-[190px] h-[160px] flex flex-col justify-between items-center shadow-inner relative overflow-hidden">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-1 w-full text-center">
            Local Repo
          </div>
          
          {/* History Timeline */}
          <div className="flex items-center gap-6 mt-4 relative w-full justify-start pl-4 h-16 z-10">
            {/* Horizontal Timeline Bar */}
            <div className="absolute left-6 right-6 h-0.5 bg-slate-700 top-1/2 -translate-y-1/2" />
            
            {/* Old Commit Node */}
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-[7px] font-mono font-bold text-slate-400 shadow-sm relative select-none flex-shrink-0">
              <span>commit</span>
              <span className="text-[6px] text-slate-500 font-normal">a1d9c</span>
              
              {/* HEAD pointer tag on old node if not committed */}
              {!isCommitted && (
                <motion.div 
                  layoutId="head-tag"
                  className="absolute -top-6 bg-indigo-500 text-white text-[6.5px] font-mono font-bold px-1 py-0.5 rounded shadow border border-indigo-400 select-none"
                >
                  HEAD
                </motion.div>
              )}
            </div>

            {/* New Commit Node (Morphs from file card!) */}
            <div className="h-10 w-10 flex items-center justify-center relative flex-shrink-0">
              {isCommitted && (
                <motion.div
                  layoutId="commit-node"
                  className="h-9 w-9 rounded-full bg-indigo-600 border border-indigo-400 flex flex-col items-center justify-center shadow-lg relative glow-indigo z-10"
                >
                  <span className="text-[7.5px] font-bold text-indigo-100">commit</span>
                  <span className="text-[6.5px] font-mono text-white font-bold leading-none">f8e5f</span>
                  
                  {/* Ping ring */}
                  <span className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-45" />

                  {/* HEAD pointer tag slides to new node! */}
                  <motion.div 
                    layoutId="head-tag"
                    className="absolute -top-6 bg-indigo-500 text-white text-[6.5px] font-mono font-bold px-1 py-0.5 rounded shadow border border-indigo-400 select-none"
                  >
                    HEAD
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="w-full text-center truncate text-[8px] font-mono text-indigo-300 z-10 font-bold px-1 mt-1 border-t border-white/5 pt-1.5">
            {isCommitted ? `Msg: "${params.message || "update"}"` : "รอการ Commit..."}
          </div>

          {/* Shockwave ripple on the Repo container */}
          {isCommitted && (
            <motion.span 
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: [1, 1.6, 2], opacity: [1, 0.4, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 rounded-xl border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.3)] pointer-events-none"
            />
          )}
        </div>

        {/* Success toast */}
        {isCommitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9.5px] text-emerald-400 font-bold"
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
    const headX = isPlaying && step > 1 ? 160 : 100;
    const headY = isPlaying && step > 1 ? 65 : 20;

    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0 select-none">
        
        {/* Graph Card */}
        <div className="w-[280px] h-[165px] border border-white/10 rounded-xl bg-slate-900/60 p-4.5 flex flex-col justify-between relative shadow-xl overflow-hidden">
          
          {/* Title label */}
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Git Graph Visualizer</span>
            <span className="text-[8.5px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/30">
              {isPlaying && step > 1 ? "Switched Branch" : "On main"}
            </span>
          </div>

          {/* SVG Canvas for Git Graph */}
          <div className="flex-1 relative w-full h-[90px] mt-1">
            <svg className="w-full h-full" viewBox="0 0 240 90">
              {/* Main Line */}
              <line x1="10" y1="20" x2="230" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="4 4" />
              <line x1="10" y1="20" x2="200" y2="20" stroke="rgba(148,163,184,0.4)" strokeWidth="3" />

              {/* Main Commit Nodes */}
              <circle cx="40" cy="20" r="5" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
              <circle cx="100" cy="20" r="5" fill="#64748B" stroke="#0F172A" strokeWidth="2" />

              {/* Branching Curve Line */}
              {isPlaying && (
                <motion.path
                  d="M 100 20 Q 120 65 140 65 L 230 65"
                  fill="none"
                  stroke="rgba(99,102,241,0.5)"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              )}

              {/* Branch Commit Node (Appears after branch is created) */}
              {isPlaying && step > 1 && (
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  cx="160"
                  cy="65"
                  r="5"
                  fill="#6366F1"
                  stroke="#0F172A"
                  strokeWidth="2"
                />
              )}

              {/* HEAD Pointer & Label (Unified vector group for pixel-perfect alignment) */}
              <motion.g
                animate={{ x: headX, y: headY }}
                transition={{ type: "spring", stiffness: 90, damping: 14 }}
              >
                {/* Glowing Pulse Ring (Framer Motion powered) */}
                <motion.circle
                  cx="0"
                  cy="0"
                  r={6}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  fill="none"
                  stroke="#818CF8"
                  strokeWidth="1.5"
                />
                {/* Pointer body */}
                <circle cx="0" cy="0" r="6" fill="rgba(99,102,241,0.25)" stroke="#818CF8" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2.5" fill="#818CF8" />

                {/* HEAD label tag above (Nested coordinate space) */}
                <g transform="translate(0, -11)">
                  {/* Pointer line */}
                  <line x1="0" y1="0" x2="0" y2="5" stroke="#818CF8" strokeWidth="1" />
                  {/* Label box */}
                  <rect x="-14" y="-11" width="28" height="11" rx="2" fill="#6366F1" stroke="#818CF8" strokeWidth="1" />
                  {/* Text */}
                  <text x="0" y="-3" fill="#FFF" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HEAD</text>
                </g>
              </motion.g>

              {/* Labels on SVG */}
              {/* main label */}
              <text x="15" y="14" fill="#94A3B8" fontSize="8" fontFamily="monospace" fontWeight="bold">main</text>
              {/* new branch label */}
              <text x="15" y="78" fill={isPlaying && step > 1 ? "#818CF8" : "#475569"} fontSize="8" fontFamily="monospace" fontWeight="bold">
                {params.branch || "feature"}
              </text>
            </svg>
          </div>
        </div>

        {/* Switched branch toast */}
        {isPlaying && step > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/25 px-3.5 py-1.5 rounded-full text-[9.5px] text-indigo-400 font-bold"
          >
            ✓ สลับสาขาทำงาน HEAD → กิ่งใหม่ "{params.branch}" สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

    if (type === "merge") {
    const isMerged = !isPlaying || step >= 2;
    const isMerging = isPlaying && step === 1;

    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0 select-none">
        
        {/* Graph Card */}
        <div className="w-[280px] h-[165px] border border-white/10 rounded-xl bg-slate-900/60 p-4.5 flex flex-col justify-between relative shadow-xl overflow-hidden">
          
          {/* Title label */}
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Git Merge Visualizer</span>
            <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/30">
              {isMerged ? "Merge Successful" : "Fast-Forwarding..."}
            </span>
          </div>

          {/* SVG Canvas for Git Graph */}
          <div className="flex-1 relative w-full h-[90px] mt-1">
            <svg className="w-full h-full" viewBox="0 0 240 90">
              {/* main branch line */}
              <line x1="10" y1="20" x2="230" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="4 4" />
              <line x1="10" y1="20" x2="180" y2="20" stroke="rgba(148,163,184,0.4)" strokeWidth="3" />

              {/* feature branch curve */}
              <path d="M 40 20 Q 60 65 80 65 L 150 65" fill="none" stroke="rgba(99,102,241,0.5)" strokeWidth="3" />

              {/* Curved connection from feature back to main */}
              {isPlaying && (
                <motion.path
                  d="M 150 65 Q 165 20 180 20"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isMerged ? 1 : (isMerging ? 0.6 : 0) }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              )}

              {/* c1 (root) */}
              <circle cx="40" cy="20" r="5" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
              <text x="36" y="32" fill="#94A3B8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">c1</text>
              <text x="31" y="40" fill="#475569" fontSize="6" fontFamily="monospace">a1d9c</text>

              {/* c2 (feature branch node) */}
              <circle cx="95" cy="65" r="5" fill="#6366F1" stroke="#0F172A" strokeWidth="2" />
              <text x="91" y="78" fill="#818CF8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">c2</text>
              <text x="86" y="86" fill="#818CF8" opacity="0.6" fontSize="6" fontFamily="monospace">b2c4d</text>

              {/* c3 (feature branch node 2) */}
              <circle cx="150" cy="65" r="5" fill="#6366F1" stroke="#0F172A" strokeWidth="2" />
              <text x="146" y="78" fill="#818CF8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">c3</text>
              <text x="141" y="86" fill="#818CF8" opacity="0.6" fontSize="6" fontFamily="monospace">f8e5f</text>

              {/* Flowing energy ping along curved path */}
              {isMerging && (
                <motion.circle
                  r="4.5"
                  fill="#34C759"
                  filter="drop-shadow(0 0 6px #10B981)"
                  animate={{
                    cx: [150, 165, 180],
                    cy: [65, 20, 20]
                  }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              {/* c4 Merge Commit Node (Landed on main branch!) */}
              {isMerged && (
                <g transform="translate(180, 20)">
                  {/* Ping Ring */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r={6.5}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: [1, 2.3], opacity: [0.8, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    fill="none"
                    stroke="#34C759"
                    strokeWidth="1.5"
                  />
                  
                  {/* Node body */}
                  <circle cx="0" cy="0" r="6.5" fill="#10B981" stroke="#0F172A" strokeWidth="2" />
                  
                  {/* Merge text label above */}
                  <text x="-9" y="-10" fill="#34C759" fontSize="7.5" fontFamily="monospace" fontWeight="bold">c4 (m)</text>
                </g>
              )}

              {/* HEAD Pointer Tag (Direct SVG group for absolute precision) */}
              <motion.g
                animate={{ 
                  x: isMerged ? 180 : 100,
                  y: 8
                }}
                transition={{ type: "spring", stiffness: 90, damping: 14 }}
              >
                {/* Pointer line */}
                <line x1="0" y1="0" x2="0" y2="6" stroke="#818CF8" strokeWidth="1" />
                {/* Label box */}
                <rect x="-14" y="-11" width="28" height="11" rx="2" fill="#6366F1" stroke="#818CF8" strokeWidth="1" />
                {/* Text */}
                <text x="0" y="-3" fill="#FFF" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">HEAD</text>
              </motion.g>

              {/* Labels on SVG */}
              {/* main label */}
              <text x="15" y="14" fill="#94A3B8" fontSize="8" fontFamily="monospace" fontWeight="bold">main</text>
              {/* feature branch label */}
              <text x="15" y="78" fill="#818CF8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                {params.branch || "feature/auth-page"}
              </text>
            </svg>
          </div>

          {/* Shockwave ripple when merged */}
          {isMerged && (
            <motion.span 
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: [1, 1.6, 2], opacity: [1, 0.4, 0] }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="absolute inset-0 rounded-xl border border-emerald-500/20 shadow-[0_0_12px_rgba(99,102,241,0.2)] pointer-events-none"
            />
          )}
        </div>

        {/* Success toast */}
        {isMerged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9.5px] text-emerald-400 font-bold"
          >
            ✓ ผสานประวัติกิ่ง "{params.branch || "feature/auth-page"}" เข้าสู่กิ่งหลักสำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

    if (type === "rebase") {
    const c3X = isPlaying && step > 0 ? 165 : 105;
    const c3Y = isPlaying && step > 0 ? 20 : 65;
    const isCompleted = isPlaying && step > 1;

    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0 select-none">
        
        {/* Graph Card */}
        <div className="w-[280px] h-[165px] border border-white/10 rounded-xl bg-slate-900/60 p-4.5 flex flex-col justify-between relative shadow-xl overflow-hidden">
          
          {/* Title label */}
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Git Rebase Visualizer</span>
            <span className="text-[8.5px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/30">
              {isCompleted ? "Rebase Complete" : "Rebasing..."}
            </span>
          </div>

          {/* SVG Canvas for Git Graph */}
          <div className="flex-1 relative w-full h-[90px] mt-1">
            <svg className="w-full h-full" viewBox="0 0 240 90">
              
              {/* main branch line */}
              <line x1="10" y1="20" x2="230" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="4 4" />
              <line x1="10" y1="20" x2="105" y2="20" stroke="rgba(148,163,184,0.4)" strokeWidth="3" />
              
              {/* Rebased line connection segment (Grows during rebase) */}
              <motion.line
                x1="105"
                y1="20"
                x2="165"
                y2="20"
                stroke="#6366F1"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isPlaying && step > 0 ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />

              {/* original feature branch path (Fades out after rebase completes) */}
              <motion.path
                d="M 45 20 Q 65 65 85 65 L 140 65"
                fill="none"
                stroke="rgba(99,102,241,0.4)"
                strokeWidth="3"
                animate={{ opacity: isCompleted ? 0 : 1 }}
                transition={{ duration: 0.6 }}
              />

              {/* Commits on main */}
              {/* c1 */}
              <circle cx="45" cy="20" r="5.5" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
              <text x="41" y="11" fill="#94A3B8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">c1</text>
              
              {/* c2 */}
              <circle cx="105" cy="20" r="5.5" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
              <text x="101" y="11" fill="#94A3B8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">c2</text>

              {/* c3 commit node (Glides dynamically from feature to main) */}
              <motion.g
                animate={{ x: c3X, y: c3Y }}
                transition={{ type: "spring", stiffness: 70, damping: 12 }}
              >
                {/* Glow ring when completed */}
                {isCompleted && (
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#34C759" strokeWidth="1.5" className="animate-pulse" />
                )}
                {/* Node body */}
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill={isCompleted ? "#10B981" : "#6366F1"}
                  stroke="#0F172A"
                  strokeWidth="2.5"
                />
                <text
                  x="-7"
                  y="-9"
                  fill={isCompleted ? "#34C759" : "#818CF8"}
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {isCompleted ? "c3'" : "c3"}
                </text>
              </motion.g>

              {/* Labels on SVG */}
              {/* target branch label (top line) */}
              <text x="10" y="32" fill="#818CF8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                {params.branch || "feature"}
              </text>
              
              {/* main label (bottom line) */}
              <motion.text
                x="10"
                y="75"
                fill="#94A3B8"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
                animate={{ opacity: isCompleted ? 0.2 : 1 }}
              >
                main
              </motion.text>
            </svg>
          </div>
        </div>

        {/* Success toast */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-full text-[9.5px] text-emerald-400 font-bold"
          >
            ✓ ย้ายฐานประวัติ (Rebase) กิ่ง "main" บนหัวกิ่ง "{params.branch || "feature"}" สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

    if (type === "push") {
    const isPushed = !isPlaying || step >= 2;
    
    return (
      <div className="flex-1 flex items-center justify-center gap-6 relative text-white min-h-0 select-none">
        
        {/* Local Machine */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 w-[110px] h-[125px] flex flex-col justify-between items-center shadow-xl relative">
            <Laptop className="h-8 w-8 text-slate-400" />
            
            <div className="flex gap-1.5 justify-center mt-1">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] font-mono text-slate-400 font-bold">c1</span>
              <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-indigo">c2</span>
            </div>
            
            <span className="text-[8.5px] font-bold text-slate-400">Local Machine</span>
          </div>
        </div>

        {/* High-tech conduit pipeline */}
        <div className="flex-1 h-5 bg-white/5 rounded-full mx-1 relative overflow-hidden max-w-[130px] border border-white/5 flex-shrink-0">
          {isPlaying && (
            <>
              {/* Laser stream */}
              <motion.div
                initial={{ left: "-50px" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-[50px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent"
              />
              
              {/* Flying File Emoji (Centering using Flexbox with infinite looping keyframes) */}
              <motion.div
                animate={{ left: ["0%", "88%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 h-full z-10 flex items-center justify-center select-none"
              >
                <span className="text-[10px] filter drop-shadow-[0_0_3px_rgba(52,199,89,0.85)]">📄</span>
              </motion.div>
            </>
          )}
        </div>

        {/* Server GitLab Cloud */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 w-[110px] h-[125px] flex flex-col justify-between items-center shadow-inner relative overflow-hidden">
            <Server className={`h-8 w-8 transition-colors duration-500 ${isPushed ? "text-emerald-400" : "text-slate-500"}`} />
            
            <div className="flex gap-1.5 justify-center mt-1">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] font-mono text-slate-400 font-bold">c1</span>
              {isPushed ? (
                <motion.span 
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  className="h-4.5 w-4.5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-indigo"
                >
                  c2
                </motion.span>
              ) : (
                <span className="h-4.5 w-4.5 rounded-full border border-dashed border-slate-800 bg-transparent flex items-center justify-center text-[7px] font-mono text-slate-700 font-bold">c2</span>
              )}
            </div>
            
            <span className="text-[8.5px] font-bold text-indigo-400">GitLab Cloud</span>

            {/* Shockwave ripple when landed */}
            {isPushed && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: [1, 1.6, 2], opacity: [1, 0.4, 0] }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="absolute inset-0 rounded-xl border border-emerald-400 shadow-[0_0_12px_rgba(52,199,89,0.3)] pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Success toast */}
        {isPushed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9.5px] text-emerald-400 font-bold"
          >
            ✓ 🚀 ดันขึ้นเซิร์ฟเวอร์บนกิ่ง [${params.branch || "main"}] สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "pull") {
    const isPulled = !isPlaying || step >= 2;
    
    return (
      <div className="flex-1 flex items-center justify-center gap-6 relative text-white min-h-0 select-none">
        
        {/* Local Machine */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 w-[110px] h-[125px] flex flex-col justify-between items-center shadow-inner relative overflow-hidden">
            <Laptop className={`h-8 w-8 transition-colors duration-500 ${isPulled ? "text-emerald-400" : "text-slate-500"}`} />
            
            <div className="flex gap-1 justify-center mt-1">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] font-mono text-slate-400 font-bold">c1</span>
              <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center text-[7px] font-mono text-white font-bold">c2</span>
              {isPulled ? (
                <motion.span 
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 150 }}
                  className="h-4.5 w-4.5 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-emerald"
                >
                  c3
                </motion.span>
              ) : (
                <span className="h-4.5 w-4.5 rounded-full border border-dashed border-slate-800 bg-transparent flex items-center justify-center text-[7px] font-mono text-slate-700 font-bold">c3</span>
              )}
            </div>
            
            <span className="text-[8.5px] font-bold text-slate-400">Local Machine</span>

            {/* Shockwave ripple when landed */}
            {isPulled && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: [1, 1.6, 2], opacity: [1, 0.4, 0] }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="absolute inset-0 rounded-xl border border-emerald-400 shadow-[0_0_12px_rgba(52,199,89,0.3)] pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* High-tech conduit pipeline */}
        <div className="flex-1 h-5 bg-white/5 rounded-full mx-1 relative overflow-hidden max-w-[130px] border border-white/5 flex-shrink-0">
          {isPlaying && (
            <>
              {/* Laser stream (flowing right-to-left) */}
              <motion.div
                initial={{ right: "-50px" }}
                animate={{ right: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-[50px] bg-gradient-to-l from-transparent via-emerald-500/25 to-transparent"
              />
              
              {/* Flying File Emoji (flowing right-to-left) */}
              <motion.div
                animate={{ right: ["0%", "88%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 h-full z-10 flex items-center justify-center select-none"
              >
                <span className="text-[10px] filter drop-shadow-[0_0_3px_rgba(52,199,89,0.85)]">📄</span>
              </motion.div>
            </>
          )}
        </div>

        {/* Server GitLab Cloud */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 w-[110px] h-[125px] flex flex-col justify-between items-center shadow-xl relative">
            <Server className="h-8 w-8 text-indigo-555 animate-pulse" />
            
            <div className="flex gap-1 justify-center mt-1">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] font-mono text-slate-400 font-bold">c1</span>
              <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-[7px] font-mono text-white font-bold">c2</span>
              <span className="h-4.5 w-4.5 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-emerald">c3</span>
            </div>
            
            <span className="text-[8.5px] font-bold text-indigo-400">GitLab Cloud</span>
          </div>
        </div>

        {/* Success toast */}
        {isPulled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9.5px] text-emerald-400 font-bold"
          >
            ✓ 📥 ดึงอัปเดตงานเพื่อนมารวมบนกิ่ง [${params.branch || "main"}] สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

    if (type === "stash") {
    const isWIP = !isPlaying || step === 0 || step === 3;
    const isStashed = isPlaying && step >= 1 && step < 3;
    const isPopping = isPlaying && step === 2;

    return (
      <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-4 relative text-white min-h-0 select-none p-4">
        
        {/* Left: Working Directory Card */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4.5 w-[145px] h-[190px] flex flex-col justify-between items-center shadow-xl relative overflow-hidden flex-shrink-0">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-1 w-full text-center">
            Working Directory
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full my-2 relative">
            <AnimatePresence mode="wait">
              {isWIP ? (
                <motion.div
                  key="work-files"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0, y: 40 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-1.5 w-full flex flex-col items-center"
                >
                  <Laptop className="h-7 w-7 text-slate-400 mb-1" />
                  {/* File 1 */}
                  <div className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1 text-[8px] font-mono text-amber-400">
                    <span className="truncate">📄 app.js</span>
                    <span className="text-[7px] bg-amber-500/20 px-1 rounded font-bold font-sans">modified</span>
                  </div>
                  {/* File 2 */}
                  <div className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1 text-[8px] font-mono text-amber-400">
                    <span className="truncate">📄 style.css</span>
                    <span className="text-[7px] bg-amber-500/20 px-1 rounded font-bold font-sans">modified</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="clean-dir"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center space-y-1"
                >
                  <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-1">
                    <motion.div
                      animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border border-emerald-400"
                    />
                    <Check className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="text-[9.5px] font-black text-emerald-400">✓ Directory Clean</span>
                  <span className="text-[7.5px] text-slate-500 font-medium">ไม่มีงานค้างในเครื่อง</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[8px] font-mono text-slate-500 w-full text-center">
            {isWIP ? "สถานะ: มีไฟล์แก้ไข" : "สถานะ: กิ่งสะอาด"}
          </div>
        </div>

        {/* Middle: Conduit Pipeline */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-[100px] h-12 relative flex-shrink-0">
          <div className="w-full h-4 bg-slate-950/60 rounded-full border border-white/5 relative overflow-hidden flex items-center">
            {isPlaying && (step === 1 || step === 2) && (
              <motion.div
                initial={{ left: step === 1 ? "-40px" : "100%" }}
                animate={{ left: step === 1 ? "100%" : "-40px" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-[40px] bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent"
              />
            )}
            
            {isPlaying && (
              <AnimatePresence>
                {((step === 1 && isStashed) || (step === 2 && !isWIP)) && (
                  <motion.div
                    initial={{ left: step === 1 ? "0%" : "80%", scale: 0.6, opacity: 0 }}
                    animate={{ left: step === 1 ? "80%" : "0%", scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="absolute z-10 flex items-center justify-center"
                  >
                    <span className="text-[9px] filter drop-shadow-[0_0_4px_#818CF8]">📦</span>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
          <div className="text-[7.5px] font-mono text-slate-500 mt-1 select-none font-bold">
            {step === 1 ? "git stash ➔" : step === 2 ? "◀ stash pop" : "conduit"}
          </div>
        </div>

        {/* Right: Stash Safe Drawer Stack */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4.5 w-[155px] h-[190px] flex flex-col justify-between items-center shadow-xl relative overflow-hidden flex-shrink-0">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-1 w-full text-center">
            🗄️ Git Stash Stack
          </div>

          <div className="w-full flex-1 flex flex-col gap-1.5 justify-center my-2">
            
            {/* Drawer 0: stash@{0} */}
            <div className="w-full h-11 border border-white/5 bg-slate-950/40 rounded p-1.5 flex items-center justify-between relative">
              <span className="text-[7.5px] font-mono text-indigo-400 font-bold">stash@{"{0}"}</span>
              
              <AnimatePresence mode="wait">
                {isStashed ? (
                  <motion.div
                    key="stash-0"
                    initial={{ scale: 0.7, opacity: 0, x: -20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.7, opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/30 rounded px-1.5 py-0.5"
                  >
                    <span className="text-[8px]">📦 WIP</span>
                    <span className="text-[8px] animate-pulse">🔒</span>
                  </motion.div>
                ) : (
                  <span key="empty-0" className="text-[7.5px] text-slate-650 italic">empty</span>
                )}
              </AnimatePresence>
            </div>

            {/* Drawer 1: stash@{1} */}
            <div className="w-full h-11 border border-white/5 bg-slate-950/40 rounded p-1.5 flex items-center justify-between opacity-55">
              <span className="text-[7.5px] font-mono text-slate-500 font-bold">stash@{"{1}"}</span>
              <div className="flex items-center gap-1 bg-slate-500/10 border border-slate-500/30 rounded px-1.5 py-0.5">
                <span className="text-[7.5px] text-slate-400 font-mono">📦 feat-auth</span>
                <span className="text-[7.5px]">🔒</span>
              </div>
            </div>

            {/* Drawer 2: stash@{2} */}
            <div className="w-full h-11 border border-dashed border-white/5 bg-transparent rounded p-1.5 flex items-center justify-between opacity-30">
              <span className="text-[7.5px] font-mono text-slate-600 font-bold">stash@{"{2}"}</span>
              <span className="text-[7px] text-slate-650 italic">empty</span>
            </div>

          </div>

          <div className="text-[8px] font-mono text-slate-500 w-full text-center">
            {isStashed ? "กล่องเก็บ: 2 Items" : "กล่องเก็บ: 1 Item"}
          </div>
        </div>

        {/* Success toast */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-[9.5px] text-indigo-400 font-bold shadow"
          >
            {step === 0 && "📁 กำลังม้วนจัดเก็บไฟล์ลงเก๊ะลิ้นชัก..."}
            {step === 1 && "📥 ซ่อนงานปัจจุบันสำเร็จ! (Working Directory สะอาดสะอาด)"}
            {step === 2 && "🔄 กำลังดึงไฟล์ล่าสุดคืนด้วย git stash pop..."}
            {step === 3 && "📤 กู้คืนไฟล์งานล่าสุดกลับมารวมที่เดิมสำเร็จ!"}
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "tag_create") {
    const isCompleted = !isPlaying || step >= 2;
    const isStamping = isPlaying && step === 1;
    const tagVal = params.version || "v1.0.0";
    
    // Tag y-coordinate state: high off-screen (-15) -> hovering (12) -> stamped (22)
    const tagY = isCompleted ? 22 : (isStamping ? 12 : -15);
    const tagOpacity = isCompleted ? 1 : (isStamping ? 0.85 : 0);

    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4 relative text-white min-h-0 select-none">
        
        {/* Graph Card */}
        <div className="w-[280px] h-[165px] border border-white/10 rounded-xl bg-slate-900/60 p-4.5 flex flex-col justify-between relative shadow-xl overflow-hidden">
          
          {/* Title label */}
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">Git Tag Visualizer</span>
            <span className="text-[8.5px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/30">
              {isCompleted ? "Tag Attached" : "WIP"}
            </span>
          </div>

          {/* SVG Canvas for Git Graph */}
          <div className="flex-1 relative w-full h-[90px] mt-1">
            <svg className="w-full h-full" viewBox="0 0 240 90">
              {/* main branch line */}
              <line x1="10" y1="45" x2="230" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="4 4" />
              <line x1="10" y1="45" x2="190" y2="45" stroke="rgba(148,163,184,0.4)" strokeWidth="3" />

              {/* c1 commit node */}
              <circle cx="60" cy="45" r="5" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
              <text x="56" y="58" fill="#94A3B8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">c1</text>
              <text x="51" y="66" fill="#475569" fontSize="6" fontFamily="monospace">a1d9c</text>

              {/* c2 commit node (Target) */}
              <circle cx="160" cy="45" r="5.5" fill="#6366F1" stroke="#0F172A" strokeWidth="2" className="glow-indigo" />
              <text x="156" y="58" fill="#818CF8" fontSize="7.5" fontFamily="monospace" fontWeight="bold">c2</text>
              <text x="151" y="66" fill="#818CF8" opacity="0.6" fontSize="6" fontFamily="monospace">f8e5f</text>

              {/* Stamping alignment line */}
              {isStamping && (
                <motion.line
                  x1="160"
                  y1="12"
                  x2="160"
                  y2="40"
                  stroke="#F59E0B"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                />
              )}

              {/* Looping Pulse Ring when tag lands */}
              {isCompleted && (
                <motion.circle
                  cx="160"
                  cy="45"
                  r={6}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: [1, 2.3], opacity: [0.8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="1.5"
                />
              )}

              {/* Descending Tag Stamp (Wrapped in static group to lock x position) */}
              <g transform="translate(160, 0)">
                <motion.g
                  animate={{ 
                    y: tagY,
                    opacity: tagOpacity
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 13 }}
                >
                  {/* Pointer connecting line */}
                  <line x1="0" y1="0" x2="0" y2="23" stroke="#F59E0B" strokeWidth="1.2" />
                  
                  {/* Stamp Tag background */}
                  <rect x="-24" y="-12" width="48" height="12" rx="2" fill="#F59E0B" stroke="#FBBF24" strokeWidth="1" />
                  
                  {/* Stamp Text */}
                  <text x="0" y="-3.5" fill="#0F172A" fontSize="6.5" fontFamily="monospace" fontWeight="extrabold" textAnchor="middle">
                    🏷️ {tagVal}
                  </text>
                </motion.g>
              </g>

              {/* main label */}
              <text x="12" y="36" fill="#94A3B8" fontSize="8" fontFamily="monospace" fontWeight="bold">main</text>
            </svg>
          </div>

          {/* Golden Shockwave on landing */}
          {isCompleted && (
            <motion.span 
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: [1, 1.6, 2], opacity: [1, 0.4, 0] }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="absolute inset-0 rounded-xl border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)] pointer-events-none"
            />
          )}
        </div>

        {/* Success toast */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9.5px] text-emerald-400 font-bold"
          >
            ✓ สร้างป้ายกำกับ "{tagVal}" ผูกติดคอมมิต [f8e5f] สำเร็จ!
          </motion.div>
        )}
      </div>
    );
  }

  if (type === "tag_push") {
    const isPushed = !isPlaying || step >= 2;
    const tagVal = params.version || "v1.0.0";
    
    return (
      <div className="flex-1 flex items-center justify-center gap-6 relative text-white min-h-0 select-none">
        
        {/* Local Machine */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 w-[110px] h-[125px] flex flex-col justify-between items-center shadow-xl relative">
            <Laptop className="h-8 w-8 text-slate-400" />
            
            <div className="flex gap-1.5 justify-center mt-1 relative pb-2">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] font-mono text-slate-400 font-bold">c1</span>
              
              {/* Local Commit c2 with Tag attached */}
              <div className="relative">
                <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-indigo">c2</span>
                <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[5px] px-1 py-0.2 rounded font-extrabold border border-amber-300 shadow-sm whitespace-nowrap">
                  {tagVal}
                </span>
              </div>
            </div>
            
            <span className="text-[8.5px] font-bold text-slate-400">Local Machine</span>
          </div>
        </div>

        {/* High-tech conduit pipeline */}
        <div className="flex-1 h-5 bg-white/5 rounded-full mx-1 relative overflow-hidden max-w-[130px] border border-white/5 flex-shrink-0">
          {isPlaying && (
            <>
              {/* Laser stream (yellow/gold) */}
              <motion.div
                initial={{ left: "-50px" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute h-full w-[50px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent"
              />
              
              {/* Flying Tag Emoji & Text (Centering using Flexbox with infinite looping keyframes) */}
              <motion.div
                animate={{ left: ["0%", "80%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 h-full z-10 flex items-center justify-center select-none"
              >
                <span className="bg-amber-500 text-slate-950 text-[4.5px] px-1 py-0.5 rounded font-extrabold border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)] whitespace-nowrap">
                  🏷️ {tagVal}
                </span>
              </motion.div>
            </>
          )}
        </div>

        {/* Server GitLab Cloud */}
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3.5 w-[110px] h-[125px] flex flex-col justify-between items-center shadow-inner relative overflow-hidden">
            <Server className={`h-8 w-8 transition-colors duration-500 ${isPushed ? "text-amber-400" : "text-slate-500"}`} />
            
            <div className="flex gap-1.5 justify-center mt-1 relative pb-2">
              <span className="h-4.5 w-4.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[7px] font-mono text-slate-400 font-bold">c1</span>
              
              {/* Remote Commit c2 (Tag appears after successful push) */}
              <div className="relative">
                <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-[7px] font-mono text-white font-bold glow-indigo">c2</span>
                {isPushed ? (
                  <motion.span 
                    initial={{ scale: 0.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 150 }}
                    className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[5px] px-1 py-0.2 rounded font-extrabold border border-amber-300 shadow-sm whitespace-nowrap"
                  >
                    {tagVal}
                  </motion.span>
                ) : (
                  <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 border border-dashed border-slate-700 bg-transparent text-slate-500 text-[4px] px-1 py-0.2 rounded font-extrabold whitespace-nowrap">
                    none
                  </span>
                )}
              </div>
            </div>
            
            <span className="text-[8.5px] font-bold text-indigo-400">GitLab Cloud</span>

            {/* Shockwave ripple when landed */}
            {isPushed && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: [1, 1.6, 2], opacity: [1, 0.4, 0] }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="absolute inset-0 rounded-xl border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)] pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Success toast */}
        {isPushed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-0 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[9.5px] text-emerald-400 font-bold"
          >
            ✓ 🚀 ดันส่งป้ายกำกับ "${tagVal}" สู่เซิร์ฟเวอร์ GitLab สำเร็จ!
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

// 6. HELPER FUNCTION TO MAP DYNAMIC STEPS FOR THE INTERACTIVE GUIDE VIEW
function getGuideStepsForPhase(phaseNum, authMethod) {
  switch (phaseNum) {
    case 1:
      return [
        {
          title: "1. ตั้งค่าระบุชื่อตัวตนผู้พัฒนา (Git Username)",
          desc: "ช่วยให้ผู้ร่วมทีมทราบว่าใครเป็นคนส่งไฟล์นี้ขึ้นระบบ GitLab",
          command: 'git config --global user.name "Somchai Dev"',
          tip: "พิมพ์ชื่อจริงของคุณแทน 'Somchai Dev' ในเครื่องคอมพิวเตอร์ตนเอง"
        },
        {
          title: "2. ตั้งค่าระบุอีเมลผู้ติดต่อ (Git User Email)",
          desc: "เชื่อมบัญชีประวัติของคอมมิตเข้าสู่โปรไฟล์ภาพบนระบบ GitLab Cloud",
          command: 'git config --global user.email "somchai.d@seagate.com"',
          tip: "ใช้อีเมลบริษัทหรือองค์กรที่ผูกกับ GitLab เสมอ"
        },
        {
          title: "3. ตรวจสอบข้อมูลความเรียบร้อยของ Git Config",
          desc: "พิมพ์รันคำสั่งเช็คลิสต์ว่าข้อมูลตัวตนเราได้รับการจัดเก็บลงระบบเรียบร้อย",
          command: 'git config --global --list',
          tip: "มองหารายการ user.name และ user.email ในลิสต์ที่แสดง"
        }
      ];
    case 2:
      if (authMethod === "ssh") {
        return [
          {
            title: "1. สร้างรหัสคู่กุญแจความปลอดภัย SSH (Ed25519 Keypair)",
            desc: "สร้างรหัสลับเฉพาะเครื่องคอมพิวเตอร์ของคุณเพื่อการแลกเปลี่ยนข้อมูลอย่างปลอดภัยโดยไม่ต้องใช้รหัสผ่าน",
            command: 'ssh-keygen -t ed25519 -C "somchai.d@seagate.com"',
            tip: "กด Enter ไปเรื่อย ๆ 3 ครั้งเพื่อเซฟลงตำแหน่งดีฟอลต์ (ข้ามการตั้ง passphrase)"
          },
          {
            title: "2. แสดงรหัสและ Copy คีย์เพื่อนำไปยืนยันตัวตน",
            desc: "เปิดอ่านเนื้อหากุญแจสาธารณะ (Public Key) ที่เครื่องผลิตเสร็จสิ้น",
            command: 'cat ~/.ssh/id_ed25519.pub',
            tip: "ลากคลุม Copy ข้อความทั้งหมดที่ขึ้นต้นด้วย ssh-ed25519"
          },
          {
            title: "3. เพิ่มคีย์ลงในโปรไฟล์ GitLab บนเว็บไซค์",
            desc: "นำคีย์สาธารณะที่คัดลอก ไปสลักไว้บน GitLab ของบัญชีตนเอง",
            tip: "ไปที่ GitLab.com → คลิกรูปโปรไฟล์มุมขวาบน → Settings → SSH Keys → กด 'Add new key' นำเนื้อหามาวางในกล่องข้อความแล้วเซฟ"
          },
          {
            title: "4. ทดสอบความถูกต้องในการเชื่อมโยง SSH key",
            desc: "ทดสอบการเคาะสัญญานไปที่ GitLab Server ว่าจำคีย์ของเราได้สำเร็จหรือไม่",
            command: 'ssh -T git@seagit.okla.seagate.com',
            tip: "หากสำเร็จจะตอบกลับว่า: 'Welcome to GitLab, @username!'"
          }
        ];
      } else {
        return [
          {
            title: "1. ตั้งค่าช่วยเหลือจำชื่อบัญชีรหัสผ่าน (HTTPS Credential Helper)",
            desc: "สั่งให้ระบบ Windows Credentials Manager บันทึกข้อมูลรหัสผ่านของเรา เพื่อไม่ต้องพิมพ์ใหม่ทุกครั้งที่อัปเดตไฟล์",
            command: 'git config --global credential.helper manager',
            tip: "หลังจากนี้เมื่อรันคำสั่ง push ครั้งแรก จะมีหน้าต่างป๊อปอัปให้ล็อกอินเพียงครั้งเดียว"
          }
        ];
      }
    case 3:
      return [
        {
          title: "1. สลับไปยังโฟลเดอร์โปรเจกต์งานในเครื่องของคุณ",
          desc: "เปิดหน้าต่าง Terminal หรือ Command Prompt ย้ายพาธไปยังจุดโปรเจกต์เป้าหมาย",
          command: 'cd C:/projects/my-web-app',
          tip: "พิมพ์พาธให้ตรงตามตำแหน่งโฟลเดอร์งานของเครื่องคุณจริง"
        },
        {
          title: "2. เริ่มต้นระบบประวัติความก้าวหน้าโครงการ (Init repository)",
          desc: "สร้างฐานข้อมูลว่างเปล่าซ่อนไว้ภายใต้โฟลเดอร์งานเพื่อคอยดักฟังการเปลี่ยนแปลง",
          command: 'git init',
          tip: "สร้างไฟล์ระบบ .git/ ขึ้นสำเร็จในเครื่องโดยอัตโนมัติ"
        }
      ];
    case 4:
      return [
        {
          title: authMethod === "ssh" ? "1. ผูกปลายทางต้นแบบผ่าน SSH (Recommended)" : "1. ผูกปลายทางต้นแบบผ่าน HTTPS",
          desc: "เชื่อมโยงโฟลเดอร์ในเครื่องปัจจุบัน เข้ากับ GitLab repository เสมือนบนคลาวด์ปลายทาง โดยใช้ชื่อตัวแทนว่า origin",
          command: authMethod === "ssh" 
            ? 'git remote add origin git@seagit.okla.seagate.com:web-gallery/webgdoc.git'
            : 'git remote add origin https://seagit.okla.seagate.com/web-gallery/webgdoc.git',
          tip: "เปลี่ยน URL ด้านบนให้ตรงตาม GitLab Repo ปลายทางที่คุณสร้างไว้"
        }
      ];
    case 5:
      return [
        {
          title: "1. ดึงประวัติไฟล์แรกเริ่มจากระบบ GitLab ลงมาสมาน (README)",
          desc: "ดึงข้อมูล README.md จาก GitLab คลาวด์มาหลอมรวมก่อนเพื่อป้องกันประวัติงานชนกระแทกกัน",
          command: 'git pull origin main --allow-unrelated-histories',
          tip: "ธง --allow-unrelated-histories จำเป็นมากในการเชื่อมรวมระบบครั้งแรกที่ประวัติยังไม่ต่อเชื่อมกัน"
        }
      ];
    case 6:
      return [
        {
          title: "1. จัดคิวระบุไฟล์ทั้งหมดเข้าด่านสเตจ (Stage changes)",
          desc: "จับไฟล์แก้ไขล่าสุดในเครื่องแพ็คส่งเข้าด่านเตรียมจดจารึกเวอร์ชัน",
          command: 'git add .',
          tip: "เครื่องหมาย . หมายถึงการนำทุกโฟลเดอร์และไฟล์เข้าคิว Staged"
        },
        {
          title: "2. พิมพ์คอมมิตบันทึกประวัติหลักการเริ่มต้นงาน",
          desc: "จารึกความเปลี่ยนแปลงพร้อมพิมพ์ข้อความเพื่อเป็นป้ายกำกับประวัติเวอร์ชันแรก",
          command: 'git commit -m "initial commit"',
          tip: "ข้อความ initial commit บ่งบอกถึงการนำเข้าโค้ดตั้งต้นอย่างเป็นทางการ"
        },
        {
          title: "3. ตั้งชื่อกิ่งการทำงานหลักเป็น main",
          desc: "เปลี่ยนชื่อกิ่งหลักดั้งเดิม (ที่อาจชื่อ master) ให้กลายเป็น main เพื่อให้สอดคล้องกับโครงสร้างมาตรฐาน GitLab",
          command: 'git branch -M main',
          tip: "อักษร -M เป็นคำสั่งบังคับย้ายและตั้งชื่อกิ่งหลักทันที"
        },
        {
          title: "4. ทำการดันโค้ดขึ้นสู่เซิร์ฟเวอร์ปลายทางพร้อมผูกสายส่ง (-u flag)",
          desc: "อัปโหลดกลุ่มงานทั้งหมดในเครื่องขึ้น GitLab Server และสั่งจดจำสายท่อนำส่งในอนาคต",
          command: 'git push -u origin main',
          tip: "ธง -u เพื่อระบุให้เครื่องลูกข่ายผูกกิ่ง main ของเราเข้าสู่ origin/main เป็นค่าเริ่มต้น"
        }
      ];
    case 7:
      return [
        {
          title: "1. นำส่งงานอัปเดตใหม่ ๆ ในวันถัดไปอย่างรวดเร็ว (Daily Push)",
          desc: "หลังจากผูกสายส่งใน Phase 6 แล้ว เมื่อต้องการแก้ไขเพิ่มเติมและอัปเดต สามารถรันตามขั้นตอน 3 คำสั่งรวดเร็วดังนี้:",
          command: 'git add .\ngit commit -m "update code"\ngit push',
          tip: "ไม่ต้องใส่ -u origin main ในคำสั่ง push อีกต่อไปแล้ว"
        },
        {
          title: "2. ดึงอัปเดตงานของเพื่อนลงมาสมาน (Daily Pull)",
          desc: "ก่อนเริ่มต้นพิมพ์โค้ดในเช้าวันใหม่ ควรทำการดึงประวัติไฟล์ล่าสุดของทีมลงมาทับเพื่อความอัปเดต",
          command: 'git pull',
          tip: "ช่วยหลีกเลี่ยงโอกาสเกิดข้อขัดแย้งของไฟล์ (Merge Conflict) ได้เป็นอย่างดี"
        }
      ];
    default:
      return [];
  }
}
