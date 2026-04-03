import { useState, useEffect, useCallback } from "react";

// ─── Config Data (editable by marketing team) ───
const CONFIG = {
  programYear: "2026",
  companyName: "Demo Corp",
  hotline: "1900 5118",
  email: "info@whitecoat.vn",
  cities: [
    {
      name: "TP. Hồ Chí Minh",
      hospitals: [
        "Phòng khám Đa khoa IVY Health",
        "Bệnh viện Đa khoa Tâm Anh",
        "Phòng khám Đa khoa Quốc tế City",
      ],
    },
    {
      name: "Hà Nội",
      hospitals: [
        "Bệnh viện Đa khoa Medlatec",
        "Phòng khám Đa khoa MEDIPLUS",
        "Bệnh viện Đa khoa Hồng Ngọc",
      ],
    },
    {
      name: "Đà Nẵng",
      hospitals: ["Bệnh viện Đa khoa Gia Đình", "Phòng khám Đa khoa Thái Bình Dương"],
    },
  ],
  timeSlots: [
    "Sáng (07:00 - 09:00)",
    "Sáng (09:00 - 11:00)",
    "Chiều (14:00 - 15:00)",
    "Chiều (15:00 - 16:00)",
  ],
  packages: {
    employee: {
      label: "Chương trình khám sức khỏe dành cho Nhân viên",
      items: [
        "Khám tổng quát",
        "Xét nghiệm tế bào cổ tử cung",
        "Siêu âm bụng tổng quát",
        "Chụp X-Quang phổi",
        "Phân tích nước tiểu",
        "Công thức máu",
        "Đường huyết đói",
        "Kiểm tra chức năng gan (SGOT, SGPT)",
        "Kiểm tra chức năng thận (Ure, Creatinine)",
        "Khám phụ khoa",
        "Siêu âm mầu tuyến vú",
      ],
    },
  },
  demoEmployee: {
    name: "Nguyễn Văn A",
    employeeId: "123456789",
    email: "demo@whitecoat.vn",
    dob: "08/08/1998",
    gender: "Nam",
  },
};

// ─── Utility Helpers ───
const generateBookingId = () => `#${CONFIG.programYear}${String(Math.floor(Math.random() * 9000 + 1000))}`;

const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000));

const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 3; i < 18; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) {
      dates.push(d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }));
    }
    if (dates.length >= 10) break;
  }
  return dates;
};

// ─── Styles ───
const palette = {
  primary: "#00adee",
  primaryDark: "#0090c7",
  primaryLight: "#E3F6FD",
  accent: "#FAC8C4",
  accentSoft: "#FFF5F4",
  bg: "#F8FBFD",
  card: "#FFFFFF",
  text: "#1E293B",
  textMuted: "#64748B",
  border: "#E2E8F0",
  success: "#10B981",
  successBg: "#ECFDF5",
  warning: "#F59E0B",
  warningBg: "#FFF8E1",
  danger: "#EF4444",
};

const font = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const baseBtn = {
  fontFamily: font,
  fontSize: 15,
  fontWeight: 600,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  padding: "12px 32px",
  transition: "all 0.2s ease",
};

const primaryBtn = {
  ...baseBtn,
  background: `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})`,
  color: "#FFF",
};

const ghostBtn = {
  ...baseBtn,
  background: "transparent",
  color: palette.primary,
  border: `1.5px solid ${palette.primary}`,
};

const dangerBtn = {
  ...baseBtn,
  background: palette.danger,
  color: "#FFF",
};

const inputStyle = {
  fontFamily: font,
  fontSize: 14,
  padding: "10px 14px",
  border: `1.5px solid ${palette.border}`,
  borderRadius: 8,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  color: palette.text,
};

const selectStyle = { ...inputStyle, background: "#FFF", appearance: "auto" };

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: palette.textMuted,
  marginBottom: 4,
  display: "block",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

// ─── Responsive CSS (injected once) ───
function ResponsiveStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      .grid-3col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
      .grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .grid-1-2 { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; }
      .grid-4col { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 0; }
      .step-bar { display: flex; justify-content: center; align-items: center; gap: 4px; padding: 20px 16px 8px; flex-wrap: wrap; }
      .consent-text { white-space: nowrap; }
      .page-header-logos { display: flex; align-items: center; justify-content: space-between; }
      @media (max-width: 768px) {
        .grid-3col { grid-template-columns: 1fr !important; }
        .grid-2col { grid-template-columns: 1fr !important; }
        .grid-1-2 { grid-template-columns: 1fr !important; }
        .grid-4col { grid-template-columns: 1fr 1fr !important; }
        .step-bar { gap: 2px; padding: 12px 8px 6px; }
        .step-bar span { display: none; }
        .step-bar .step-line { width: 12px !important; }
        .consent-text { white-space: normal !important; }
        .page-header-logos {
          flex-direction: column-reverse !important;
          align-items: center !important;
          gap: 12px !important;
        }
        .page-header-logos > .badge-right {
          align-self: center;
        }
        .page-header-logos {
          gap: 24px !important;
        }
        .step1-badge {
          position: static !important;
          justify-content: center;
          margin-bottom: 28px;
        }
        .step1-logo {
          margin-bottom: 24px;
        }
      }
      @media (max-width: 480px) {
        .grid-4col { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

function Logo({ size = 32 }) {
  const h = size;
  const w = size * (3420 / 1028);
  return (
    <svg width={w} height={h} viewBox="0 0 3420.05 1028.57" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fill="#FAC8C4" d="M1114.12,201.54h-249.68c-3.18,0-6.04,1.94-7.19,4.93l-158.57,411.29c-2.44,6.32-11.3,6.59-14.16.46l-82.03-177.89c-1.98-4.33-5.21-7.93-9.08-10.42-3.92-2.49-8.48-3.87-13.32-3.87-9.45,0-18.12,5.39-22.22,13.97l-86.64,180.33c-2.81,5.81-11.11,5.81-13.88-.05l-134.17-282c-1.89-3.92-4.84-7.15-8.35-9.41-4.38-2.75-9.58-4-15.02-3.32-9.11,1.13-16.43,8.13-19.06,16.93l-46.42,154.97c-.97,3.27-3.97,5.49-7.38,5.49H34.54c-3.87-9.59-7.29-19.09-10.42-28.68C2.12,406.63.14,357.98,0,344.38v-4.43c0-36.38,4.47-186.46,123.62-277.53C189.69,11.9,261.66,1.94,300.3,0h3.5c27.62,0,89.96,4.15,153.17,44.96,74.46,48.09,103.28,116.75,112,140.4,8.62-23.65,37.49-92.31,111.95-140.4C744.14,4.15,806.43,0,834.1,0h3.5c38.64,1.94,110.61,11.9,176.69,62.43,52.19,39.88,82.4,91.11,99.83,139.11Z"/>
        <path fill="#00adee" d="M1137.92,344.41c-.13,13.59-2.15,62.25-24.18,129.87-27.92,85.82-79.46,164.24-269.94,333.09-61.77,54.63-140.54,133.19-235.61,208.17-10.97,8.17-24.56,13.03-39.28,13.03s-28.31-4.86-39.23-13.03c-.86-.65-1.68-1.29-2.5-1.98-40.18-31.75-77.43-64.23-111.72-95.11-45.86-41.38-86.34-80.1-121.35-111.07-140.37-124.45-205.37-199.73-240.95-265.12h214.88c3.4,0,6.45-2.28,7.36-5.59l28.39-98.51c1.98-6.88,11.4-7.57,14.41-1.12l124.15,269.21c1.98,4.3,5.12,7.79,8.95,10.28,3.87,2.45,8.39,3.83,13.12,3.83,9.29,0,17.81-5.33,21.85-13.72l87.37-180.98c.26-.52.47-.95.86-1.38,3.18-3.83,8.86-3.83,12.09,0,.39.47.65.9.9,1.42l87.03,181.28c1.98,4.13,5.03,7.44,8.65,9.77,5.29,3.27,11.87,4.52,18.41,2.84,7.74-1.94,13.77-8.04,16.56-15.53l170.01-450.96c1.12-2.93,4-4.95,7.23-4.95h232.3c10.54,46.85,10.28,84.66,10.24,96.28Z"/>
      </g>
      <g fill="#1E293B">
        <path d="M1355.5,685.59c-2.31-1.23-3.95-3.88-4.9-7.89l-80.51-310.35c-.61-3.13-.95-5.17-.95-6.13,0-2.18.75-3.74,2.11-4.7,1.43-.88,3.68-1.36,6.81-1.36h24.77c5.31,0,9.19.68,11.5,2.11,2.31,1.36,3.95,4.29,4.9,8.64l48.66,203.15c1.57,7.83,3.95,22.8,7.08,44.92l1.36,11.23h1.91c3.13-23.41,6.4-42.13,9.8-56.15l55.74-199.41c1.23-4.36,2.99-7.28,5.38-8.64,2.31-1.43,5.99-2.11,10.96-2.11h19.19c5.04,0,8.71.68,11.03,2.11,2.31,1.36,4.15,4.29,5.38,8.64l54.79,199.89c3.4,13.07,6.87,31.65,10.28,55.67h1.91l1.84-12.18c3.47-24.02,5.65-38.38,6.53-43.01l48.25-204.11c1.23-4.36,3.06-7.28,5.38-8.64,2.31-1.43,5.99-2.11,11.03-2.11h21.98c3.13,0,5.38.48,6.81,1.36,1.36.95,2.11,2.52,2.11,4.7,0,.95-.34,2.99-.95,6.13l-80.99,309.87c-.95,4.02-2.52,6.74-4.7,8.17-2.18,1.43-5.58,2.11-10.28,2.11h-20.15c-4.36,0-7.69-.68-10.07-2.11-2.31-1.43-4.15-3.95-5.38-7.69l-56.15-208.33c-4.08-16.2-6.87-32.6-8.44-49.14h-2.31c-1.91,17.15-5.04,33.35-9.39,48.66l-56.62,208.33c-1.29,4.02-2.99,6.74-5.17,8.17-2.18,1.43-5.58,2.11-10.28,2.11h-19.67c-4.7,0-8.17-.61-10.55-1.91Z"/>
        <path d="M1708.45,684.91c-1.7-1.7-2.59-4.56-2.59-8.64v-323.96c0-4.36.88-7.28,2.59-8.85,1.7-1.57,4.63-2.38,8.64-2.38h19.67c4.08,0,6.87.82,8.44,2.38,1.57,1.57,2.31,4.49,2.31,8.85v96.92c5.65-2.52,14.5-4.83,26.68-7.01,12.18-2.18,25.32-3.27,39.34-3.27,31.85,0,55.54,7.96,71.12,23.89,15.65,15.86,23.41,38.79,23.41,68.81v144.62c0,4.36-.75,7.35-2.31,8.92-1.57,1.57-4.36,2.31-8.44,2.31h-19.67c-4.02,0-6.94-.88-8.64-2.59-1.7-1.7-2.59-4.56-2.59-8.64v-143.26c0-18.1-4.9-31.99-14.7-41.65-9.87-9.66-24.64-14.5-44.24-14.5-11.91,0-23.34,1.09-34.44,3.27-11.09,2.18-19.6,4.7-25.52,7.49v188.66c0,4.36-.75,7.35-2.31,8.92-1.57,1.57-4.36,2.31-8.44,2.31h-19.67c-4.02,0-6.94-.88-8.64-2.59Z"/>
        <path d="M1962.38,371.5c0-8.71,1.5-14.5,4.42-17.29,2.99-2.79,8.85-4.22,17.56-4.22h3.27c8.44,0,14.22,1.5,17.35,4.42,3.06,2.99,4.63,8.71,4.63,17.08v3.33c0,8.37-1.57,14.09-4.63,17.08-3.13,2.93-8.92,4.42-17.35,4.42h-3.27c-8.71,0-14.56-1.43-17.56-4.22-2.93-2.79-4.42-8.58-4.42-17.29v-3.33ZM1967.75,684.91c-1.7-1.7-2.59-4.56-2.59-8.64v-219.08c0-4.36.88-7.35,2.59-8.92,1.7-1.57,4.63-2.31,8.64-2.31h19.19c4.36,0,7.35.75,8.92,2.31,1.57,1.57,2.31,4.56,2.31,8.92v219.08c0,4.08-.75,6.94-2.31,8.64-1.57,1.7-4.56,2.59-8.92,2.59h-19.19c-4.02,0-6.94-.88-8.64-2.59Z"/>
        <path d="M2131.16,678.85c-14.56-5.78-25.05-15.79-31.65-29.95-6.53-14.22-9.8-34.44-9.8-60.64v-103.93h-38.86c-4.08,0-6.94-.75-8.64-2.31-1.77-1.57-2.59-4.42-2.59-8.44v-16.4c0-4.36.82-7.35,2.59-8.92,1.7-1.57,4.56-2.31,8.64-2.31h38.86v-44.92c0-4.36.82-7.35,2.59-8.92,1.7-1.57,4.56-2.31,8.64-2.31h19.19c4.36,0,7.35.75,8.92,2.31,1.5,1.57,2.31,4.56,2.31,8.92v44.92h61.32c4.36,0,7.35.75,8.92,2.31,1.57,1.57,2.31,4.56,2.31,8.92v16.4c0,4.02-.88,6.87-2.59,8.44-1.7,1.57-4.56,2.31-8.64,2.31h-61.32v102.5c0,17.15,1.91,30.08,5.65,38.66,3.74,8.58,9.8,14.43,18.24,17.56,8.44,3.06,20.76,4.63,36.96,4.63,4.36,0,7.35.88,8.92,2.59,1.57,1.7,2.31,4.76,2.31,9.12v16.4c0,4.36-.82,7.42-2.59,9.12-1.7,1.7-4.56,2.59-8.64,2.59-26.2,0-46.55-2.86-61.05-8.64Z"/>
        <path d="M2257.34,661.29c-17.22-17.49-25.79-41.18-25.79-71.12v-58.05c0-31.85,9.19-56.49,27.43-73.98,18.24-17.49,44.37-26.2,78.4-26.2s60.91,8.92,78.88,26.68c17.9,17.76,26.88,41.18,26.88,70.24v27.09c0,10.96-5.58,16.4-16.81,16.4h-153.06v22.46c0,17.83,5.38,31.72,16.13,41.65,10.75,10,26.27,15.04,46.55,15.04,30.63,0,52.47-10.96,65.54-32.8,3.4-4.7,6.87-7.01,10.28-7.01,2.18,0,4.83.95,7.96,2.79l12.66,6.6c4.7,2.18,7.01,5.44,7.01,9.8,0,2.18-.95,4.97-2.79,8.44-19.06,32.12-52.61,48.19-100.66,48.19-35.25,0-61.46-8.71-78.61-26.2ZM2401.49,540.08v-13.61c0-18.72-5.44-33.21-16.4-43.49-10.89-10.34-26.82-15.45-47.71-15.45s-36.82,5.1-47.78,15.45c-10.89,10.28-16.33,24.77-16.33,43.49v13.61h128.22Z"/>
        <path d="M2520.12,655.64c-22.66-21.17-33.96-50.5-33.96-88v-106.72c0-37.43,11.3-66.77,33.96-88,22.6-21.23,54.86-31.78,96.64-31.78,34.3,0,61.73,6.67,82.15,20.08,20.42,13.41,35.05,33.28,43.76,59.48.95,2.18,1.43,4.36,1.43,6.53s-.68,4.02-2.11,5.38c-1.43,1.43-3.68,2.72-6.81,4.02l-19.67,6.53c-3.74.61-5.92.95-6.53.95-2.18,0-3.88-.61-5.17-1.91-1.23-1.23-2.45-3.4-3.74-6.53-5.92-17.83-15.52-30.97-28.79-39.54-13.27-8.58-31.44-12.86-54.51-12.86-27.77,0-49,6.67-63.63,20.08-14.7,13.41-22.05,32.46-22.05,57.1v107.67c0,24.36,7.42,43.35,22.26,56.9,14.84,13.54,36,20.35,63.43,20.35,23.41,0,41.72-4.36,54.99-13.07,13.27-8.78,22.87-22.19,28.79-40.29,2.18-6.26,5.31-9.32,9.39-9.32,2.18,0,4.36.41,6.53,1.36l19.19,7.01c3.13,1.29,5.38,2.59,6.81,4.02,1.36,1.36,2.11,3.2,2.11,5.38,0,1.84-.48,4.08-1.43,6.53-8.71,26.54-23.21,46.62-43.49,60.16-20.35,13.54-47.91,20.35-82.9,20.35-41.79,0-74.05-10.62-96.64-31.85Z"/>
        <path d="M2808.89,663.61c-18.51-15.86-27.84-37.7-27.84-65.54v-76.7c0-27.84,9.32-49.68,27.84-65.54,18.58-15.93,44.24-23.89,77.04-23.89s59.28,7.96,77.72,23.89c18.38,15.86,27.56,37.7,27.56,65.54v76.7c0,27.84-9.19,49.68-27.56,65.54-18.44,15.93-44.37,23.89-77.72,23.89s-58.46-7.96-77.04-23.89ZM2839.58,636.04c11.23,9.05,26.68,13.54,46.35,13.54s35.59-4.49,46.82-13.54c11.23-9.05,16.81-21.71,16.81-37.98v-76.7c0-16.27-5.51-28.92-16.61-37.98-11.09-9.05-26.75-13.54-47.03-13.54s-35.12,4.49-46.35,13.54c-11.23,9.05-16.88,21.71-16.88,37.98v76.7c0,16.27,5.65,28.92,16.88,37.98Z"/>
        <path d="M3069.89,679.06c-14.97-5.58-25.45-13.82-31.37-24.57-5.92-10.75-8.85-24.57-8.85-41.38,0-18.44,3.47-32.87,10.48-43.35,7.01-10.41,18.1-17.97,33.28-22.66,15.11-4.7,35.32-7.01,60.57-7.01,11.57,0,26.2.75,44.03,2.31l9.8.95v-18.24c0-18.1-4.15-31.99-12.39-41.72-8.3-9.66-22.73-14.5-43.29-14.5-27.77,0-47.3,9.66-58.53,29.06-1.23,2.18-2.59,3.88-3.95,5.1-1.43,1.29-2.93,1.91-4.49,1.91-.61,0-2.79-.61-6.53-1.91l-14.97-6.06c-5.31-2.52-7.96-5.44-7.96-8.92,0-2.18.61-4.49,1.84-7.01,17.49-32.74,49.34-49.14,95.55-49.14,35.25,0,60.1,8.44,74.66,25.25,14.5,16.88,21.71,39.95,21.71,69.28v122.16c0,8.17-1.16,13.88-3.47,17.35-2.38,3.4-6.81,6.53-13.34,9.32-18.72,8.17-45.6,12.18-80.51,12.18-26.54,0-47.3-2.79-62.27-8.44ZM3083.71,643.05c7.96,6.53,22.87,9.8,44.71,9.8,23.07,0,40.43-2.04,51.93-6.06,3.13-.95,5.17-2.11,6.13-3.54.88-1.36,1.36-3.68,1.36-6.81v-59.89c-21.85-2.18-41.31-3.27-58.46-3.27-21.23,0-36.14,3.13-44.71,9.39-8.64,6.19-12.86,16.2-12.86,29.95s3.95,23.82,11.91,30.42Z"/>
        <path d="M3347.3,678.85c-14.56-5.78-25.05-15.79-31.65-29.95-6.53-14.22-9.8-34.44-9.8-60.64v-103.93h-38.86c-4.08,0-6.94-.75-8.64-2.31-1.77-1.57-2.59-4.42-2.59-8.44v-16.4c0-4.36.82-7.35,2.59-8.92,1.7-1.57,4.56-2.31,8.64-2.31h38.86v-44.92c0-4.36.82-7.35,2.59-8.92,1.7-1.57,4.56-2.31,8.64-2.31h19.19c4.36,0,7.35.75,8.92,2.31,1.5,1.57,2.31,4.56,2.31,8.92v44.92h61.32c4.36,0,7.35.75,8.92,2.31,1.57,1.57,2.31,4.56,2.31,8.92v16.4c0,4.02-.88,6.87-2.59,8.44-1.7,1.57-4.56,2.31-8.64,2.31h-61.32v102.5c0,17.15,1.91,30.08,5.65,38.66,3.74,8.58,9.8,14.43,18.24,17.56,8.44,3.06,20.76,4.63,36.96,4.63,4.36,0,7.35.88,8.92,2.59,1.57,1.7,2.31,4.76,2.31,9.12v16.4c0,4.36-.82,7.42-2.59,9.12-1.7,1.7-4.56,2.59-8.64,2.59-26.2,0-46.55-2.86-61.05-8.64Z"/>
      </g>
    </svg>
  );
}

function Badge({ children, color = palette.primary }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        background: color + "18",
        color,
        letterSpacing: 0.3,
      }}
    >
      {children}
    </span>
  );
}

function DemoBanner() {
  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${palette.warningBg}, #FFF3E0)`,
        borderBottom: `2px solid ${palette.warning}`,
        padding: "8px 16px",
        textAlign: "center",
        fontSize: 13,
        fontWeight: 600,
        color: "#92400E",
        fontFamily: font,
      }}
    >
      🔶 ĐÂY LÀ GIAO DIỆN ĐĂNG KÝ LỊCH KHÁM DEMO - Dữ liệu hiển thị là giả lập và không có tính năng lưu trữ thông tin thật
    </div>
  );
}

function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 24px",
        background: "#FFF",
        borderBottom: `1px solid ${palette.border}`,
      }}
    >
      <Logo size={28} />
      <div style={{ fontSize: 12, color: palette.textMuted, fontFamily: font }}>
        Đơn vị đồng hành <strong style={{ color: palette.text }}>WhiteCoat</strong>
      </div>
    </header>
  );
}

function StepIndicator({ current, total = 5, onStepClick }) {
  const labels = [
    "Truy cập",
    "Xác thực Email",
    "Đăng ký cá nhân",
    "Xác nhận",
  ];
  return (
    <div className="step-bar">
      {labels.map((l, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        const isClickable = isDone || isActive;
        return (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 4, cursor: isClickable ? "pointer" : "default" }}
            onClick={() => isClickable && onStepClick && onStepClick(step)}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: font,
                background: isDone ? palette.success : isActive ? palette.primary : palette.border,
                color: isDone || isActive ? "#FFF" : palette.textMuted,
                transition: "all 0.3s",
              }}
            >
              {isDone ? "✓" : step}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? palette.primary : isDone ? palette.success : palette.textMuted,
                fontFamily: font,
                marginRight: 8,
                textDecoration: isClickable && !isActive ? "underline" : "none",
              }}
            >
              {l}
            </span>
            {i < labels.length - 1 && (
              <div className="step-line" style={{ width: 20, height: 2, background: isDone ? palette.success : palette.border, marginRight: 4 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Card({ children, style: s = {} }) {
  return (
    <div
      style={{
        background: palette.card,
        borderRadius: 12,
        border: `1px solid ${palette.border}`,
        padding: 28,
        maxWidth: 720,
        margin: "0 auto",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        ...s,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3
      style={{
        fontFamily: font,
        fontSize: 13,
        fontWeight: 700,
        color: palette.primary,
        textTransform: "uppercase",
        letterSpacing: 1,
        margin: "0 0 16px",
        paddingBottom: 8,
        borderBottom: `2px solid ${palette.primaryLight}`,
      }}
    >
      {children}
    </h3>
  );
}

function PackageGrid({ items }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            padding: "6px 14px",
            borderRadius: 6,
            background: palette.primaryLight,
            fontSize: 13,
            color: palette.primaryDark,
            fontFamily: font,
            fontWeight: 500,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function TermsModal({ title, onClose }) {
  const isBaoMat = title === "Điều khoản Bảo mật";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFF",
          borderRadius: 12,
          width: "100%",
          maxWidth: 560,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: palette.primary, padding: "16px 24px", textAlign: "center" }}>
          <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: "#FFF", margin: 0 }}>
            {title}
          </h3>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, fontSize: 14, fontFamily: font, color: palette.text, lineHeight: 1.7 }}>
          {isBaoMat ? (
            <>
              <p>Công ty TNHH WhiteCoat Vietnam ("WhiteCoat", "chúng tôi", hoặc "của chúng tôi") cam kết bảo vệ dữ liệu cá nhân mà bạn cung cấp cho chúng tôi. Chính sách Quyền riêng tư này đưa ra các cách mà chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn. Nếu bạn có bất kỳ câu hỏi nào, vui lòng gửi email đến nhóm bảo vệ dữ liệu của chúng tôi tại cskh@whitecoat.vn</p>
              <p><strong>Tổng quan</strong></p>
              <p>Việc truy cập và/hoặc sử dụng bất kỳ trang web hoặc ứng dụng điện tử nào do WhiteCoat hoặc bất kỳ công ty liên kết hoặc công ty có liên quan của WhiteCoat sở hữu và/hoặc duy trì, bao gồm ứng dụng tư vấn sức khỏe trực tuyến, tư vấn đơn thuốc và giao hàng của WhiteCoat và trang web của chúng tôi tại https://whitecoat.vn/ (gọi chung là "Trang web WhiteCoat") và/hoặc bất kỳ dịch vụ nào do chúng tôi cung cấp hoặc được hiển thị trên hoặc thông qua bất kỳ Trang web WhiteCoat nào ("Dịch vụ") đều có điều kiện khi bạn chấp nhận các điều khoản và điều kiện được nêu trong Chính sách Quyền riêng tư này.</p>
              <p><strong>Thu thập dữ liệu cá nhân</strong></p>
              <p>Chúng tôi thu thập dữ liệu cá nhân khi bạn đăng ký sử dụng dịch vụ của chúng tôi, bao gồm nhưng không giới hạn: họ tên, ngày sinh, giới tính, số điện thoại, địa chỉ email, và các thông tin y tế liên quan đến việc khám sức khỏe.</p>
              <p><strong>Sử dụng dữ liệu</strong></p>
              <p>Dữ liệu cá nhân của bạn được sử dụng để: cung cấp dịch vụ đặt lịch khám sức khỏe, liên hệ xác nhận lịch hẹn, gửi kết quả khám, và cải thiện chất lượng dịch vụ của chúng tôi.</p>
            </>
          ) : (
            <>
              <p><strong>Điều khoản sử dụng dịch vụ đặt lịch khám sức khỏe</strong></p>
              <p>Bằng việc sử dụng hệ thống đặt lịch khám sức khỏe của WhiteCoat, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây:</p>
              <p><strong>1. Đăng ký và xác nhận lịch hẹn</strong></p>
              <p>Người dùng có trách nhiệm cung cấp thông tin chính xác và đầy đủ khi đăng ký lịch khám. WhiteCoat không chịu trách nhiệm cho các sai sót phát sinh từ thông tin không chính xác do người dùng cung cấp.</p>
              <p><strong>2. Thay đổi và huỷ lịch</strong></p>
              <p>Người dùng có thể thay đổi hoặc huỷ lịch hẹn thông qua hệ thống. Lịch khám đã xác nhận huỷ sẽ không thể hoàn tác. Vui lòng liên hệ tổng đài 1900 5118 nếu cần hỗ trợ thêm.</p>
              <p><strong>3. Quyền và nghĩa vụ</strong></p>
              <p>WhiteCoat cam kết bảo mật thông tin cá nhân của người dùng theo Chính sách Bảo mật. Người dùng có quyền yêu cầu chỉnh sửa hoặc xoá thông tin cá nhân bằng cách liên hệ với chúng tôi.</p>
              <p><strong>4. Chi phí dịch vụ</strong></p>
              <p>Chi phí khám sức khỏe sẽ được áp dụng theo gói khám mà doanh nghiệp đã đăng ký. Đối với người thân, CBNV sẽ tự thanh toán chi phí với mức ưu đãi như nhân viên công ty.</p>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${palette.border}`, textAlign: "center" }}>
          <button
            style={{
              ...baseBtn,
              padding: "10px 48px",
              fontSize: 14,
              borderRadius: 8,
              background: "#FFF",
              color: palette.text,
              border: `1.5px solid ${palette.border}`,
            }}
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step Components ───

function Step1_Landing({ onNext }) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Vui lòng nhập email đã đăng ký.");
      return;
    }
    if (!agreed) {
      setError("Vui lòng đồng ý với Điều khoản Bảo mật để tiếp tục.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email.trim() }),
      });
      const data = await res.json();
      if (data.success && data.otp) {
        onNext(email.trim(), data.otp);
      } else {
        setError("Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    }
    setSending(false);
  };

  const isReady = agreed && email.trim() && !sending;

  return (
    <div style={{ position: "relative", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      {/* Top-right WhiteCoat badge */}
      <div className="step1-badge" style={{ position: "absolute", top: 20, right: 32, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: palette.textMuted, fontFamily: font }}>Đơn vị đồng hành</span>
        <Logo size={28} />
      </div>

      {/* Center logo */}
      <div className="step1-logo" style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
        <Logo size={64} />
      </div>

      {/* Heading */}
      <p style={{ fontSize: 14, color: palette.primary, fontWeight: 600, margin: "0 0 6px", fontFamily: font, textAlign: "center" }}>
        Hệ thống đặt lịch dịch vụ
      </p>
      <h2 style={{ fontFamily: font, fontSize: 26, fontWeight: 800, color: palette.primary, margin: "0 0 32px", textAlign: "center", letterSpacing: 0.5 }}>
        CHƯƠNG TRÌNH KHÁM SỨC KHỎE {CONFIG.programYear}
      </h2>

      {/* Subtitle */}
      <p style={{ fontSize: 15, color: palette.textMuted, fontFamily: font, marginBottom: 28, textAlign: "center" }}>
        Anh/Chị vui lòng cung cấp email đã đăng ký để xác nhận thông tin
      </p>

      {/* Email input - wider */}
      <div style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Nhập email đã đăng ký"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          style={{
            ...inputStyle,
            textAlign: "center",
            marginBottom: 20,
            padding: "14px 18px",
            fontSize: 15,
            borderRadius: 10,
            border: `1px solid ${palette.border}`,
            background: "#FFF",
          }}
          onFocus={(e) => (e.target.style.borderColor = palette.primary)}
          onBlur={(e) => (e.target.style.borderColor = palette.border)}
        />

        {/* Consent checkbox */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, justifyContent: "center", marginBottom: 24, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
            style={{ accentColor: palette.primary, width: 18, height: 18, flexShrink: 0, marginTop: 2 }}
          />
          <span className="consent-text" style={{ fontSize: 14, color: palette.text, fontFamily: font }}>
            Tôi đã đọc và đồng ý với các{" "}
            <span
              style={{ color: palette.primary, fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTerms(true); }}
            >Điều khoản Bảo mật</span>{" "}
            của WhiteCoat
          </span>
        </label>

        {showTerms && <TermsModal title="Điều khoản Bảo mật" onClose={() => setShowTerms(false)} />}

        {/* Error */}
        {error && (
          <div style={{ fontSize: 13, color: palette.danger, fontFamily: font, marginBottom: 14, fontWeight: 500, textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Submit button - matching Figma style */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{
              ...baseBtn,
              width: 280,
              maxWidth: "100%",
              padding: "14px 0",
              fontSize: 16,
              borderRadius: 30,
              background: isReady
                ? `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDark})`
                : "#E8E8E8",
              color: isReady ? "#FFF" : "#B0B0B0",
              fontWeight: 600,
              cursor: isReady ? "pointer" : "default",
            }}
            onClick={handleSubmit}
          >
            {sending ? "Đang gửi mã OTP..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Step2_OTP({ onNext, userEmail, realOtp, onResendOtp }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSent(true), 800);
    return () => clearTimeout(t);
  }, []);

  const handleDigit = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 3) {
      const el = document.getElementById(`otp-${idx + 1}`);
      if (el) el.focus();
    }
  };

  const isFilled = otp.every((d) => d !== "");

  const handleVerify = () => {
    if (!isFilled) {
      setError("Vui lòng nhập đầy đủ mã OTP 4 chữ số.");
      return;
    }
    if (otp.join("") !== realOtp) {
      setError("Mã OTP không chính xác. Vui lòng kiểm tra lại.");
      return;
    }
    setError("");
    setVerified(true);
    setTimeout(onNext, 1000);
  };

  const handleResend = async () => {
    setResending(true);
    setOtp(["", "", "", ""]);
    setError("");
    if (onResendOtp) await onResendOtp();
    setResending(false);
  };

  return (
    <Card>
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <h3 style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: palette.text, marginBottom: 8 }}>Xác thực OTP</h3>
        {!sent ? (
          <p style={{ fontSize: 14, color: palette.textMuted, fontFamily: font }}>Đang gửi mã OTP...</p>
        ) : (
          <>
            <p style={{ fontSize: 14, color: palette.textMuted, fontFamily: font, marginBottom: 4 }}>
              Điền mã OTP 4 chữ số được gửi về email
            </p>
            <p style={{ fontSize: 13, color: palette.primary, fontFamily: font, marginBottom: 20, fontWeight: 500 }}>
              📧 {userEmail}
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 12 }}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(e.target.value, i)}
                  style={{
                    ...inputStyle,
                    width: 52,
                    height: 52,
                    textAlign: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    borderColor: error && !isFilled ? palette.danger : d ? palette.primary : palette.border,
                  }}
                />
              ))}
            </div>
            {error && (
              <div style={{ fontSize: 13, color: palette.danger, fontFamily: font, marginBottom: 12, fontWeight: 500 }}>
                {error}
              </div>
            )}
            {verified ? (
              <div style={{ color: palette.success, fontWeight: 600, fontSize: 14, fontFamily: font, marginTop: 8 }}>
                ✓ Xác thực thành công!
              </div>
            ) : (
              <>
                <button
                  style={{ ...primaryBtn, width: 200, opacity: isFilled ? 1 : 0.5, marginTop: 8 }}
                  onClick={handleVerify}
                >
                  Xác thực
                </button>
                <p
                  onClick={handleResend}
                  style={{
                    fontSize: 13,
                    color: palette.primary,
                    fontFamily: font,
                    marginTop: 12,
                    cursor: resending ? "default" : "pointer",
                    textDecoration: "underline",
                    opacity: resending ? 0.5 : 1,
                  }}
                >
                  {resending ? "Đang gửi lại..." : "Gửi lại mã OTP"}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

function Step3_Employee({ onNext, onBookingData, initialData, userEmail }) {
  const emp = CONFIG.demoEmployee;
  const prev = initialData?.employee;
  const [city, setCity] = useState(prev?.city || "");
  const [hospital, setHospital] = useState(prev?.hospital || "");
  const [date, setDate] = useState(prev?.date || "");
  const [time, setTime] = useState(prev?.time || "");
  const [phone, setPhone] = useState(prev?.phone || "0345678xxx");
  const [agreed, setAgreed] = useState(!!prev);
  const [errors, setErrors] = useState({});
  const [showTerms, setShowTerms] = useState(false);

  const displayEmail = userEmail || emp.email;

  const hospitals = CONFIG.cities.find((c) => c.name === city)?.hospitals || [];
  const dates = getAvailableDates();

  const errorStyle = { fontSize: 13, color: palette.danger, fontFamily: font, fontWeight: 500, marginTop: 8, marginBottom: 0 };

  const clearError = (key) => setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });

  const handleSubmit = () => {
    const newErrors = {};
    if (!phone.trim()) newErrors.personal = "Vui lòng nhập đầy đủ thông tin cá nhân (Số điện thoại).";
    if (!city || !hospital || !date || !time) newErrors.booking = "Vui lòng chọn đầy đủ thông tin đặt lịch khám.";
    if (!agreed) newErrors.consent = "Vui lòng đồng ý với Điều khoản Dịch vụ để tiếp tục.";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    onBookingData({ employee: { ...emp, email: displayEmail, phone, city, hospital, date, time }, bookingId: initialData?.bookingId || generateBookingId() });
    onNext();
  };

  const isReady = city && hospital && date && time && phone.trim() && agreed;

  const sectionHeader = (text) => (
    <div style={{ background: "#F5F5F5", padding: "10px 20px", borderRadius: "8px 8px 0 0", marginBottom: 0 }}>
      <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: palette.text }}>{text}</span>
    </div>
  );

  const fieldLabel = { fontSize: 13, fontWeight: 600, color: palette.text, marginBottom: 6, display: "block", fontFamily: font };
  const fieldInput = { ...inputStyle, borderRadius: 8, padding: "12px 14px", fontSize: 14, background: "#FFF" };
  const fieldInputReadonly = { ...fieldInput, background: "#FAFAFA", color: palette.text };
  const fieldSelect = { ...selectStyle, borderRadius: 8, padding: "12px 14px", fontSize: 14 };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
      {/* Page header with logos */}
      <div className="page-header-logos" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 28px" }}>
        <Logo size={36} />
        <div className="badge-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: palette.textMuted, fontFamily: font }}>Đơn vị đồng hành</span>
          <Logo size={24} />
        </div>
      </div>

      {/* Title */}
      <h2 style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: palette.text, textAlign: "center", margin: "0 0 32px" }}>
        Đăng ký sử dụng dịch vụ
      </h2>

      {/* Section: Thông tin cá nhân */}
      {sectionHeader("Thông tin cá nhân")}
      <div style={{ border: `1px solid ${palette.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 20, marginBottom: 4 }}>
        <div className="grid-3col" style={{ marginBottom: 16 }}>
          <div>
            <label style={fieldLabel}>Họ Tên</label>
            <input style={fieldInputReadonly} value={emp.name} readOnly />
          </div>
          <div>
            <label style={fieldLabel}>Email</label>
            <input style={fieldInputReadonly} value={displayEmail} readOnly />
          </div>
          <div>
            <label style={fieldLabel}>Mã nhân viên</label>
            <input style={fieldInputReadonly} value={emp.employeeId} readOnly />
          </div>
        </div>
        <div className="grid-3col">
          <div>
            <label style={fieldLabel}>Ngày sinh</label>
            <input style={fieldInputReadonly} value={emp.dob} readOnly />
          </div>
          <div>
            <label style={fieldLabel}>Giới tính</label>
            <div style={{ display: "flex", gap: 0 }}>
              {["Nam", "Nữ"].map((g) => (
                <div
                  key={g}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: font,
                    borderRadius: g === "Nam" ? "8px 0 0 8px" : "0 8px 8px 0",
                    background: emp.gender === g ? "#F0F0F0" : "#FFF",
                    color: emp.gender === g ? palette.primary : palette.textMuted,
                    border: `1px solid ${palette.border}`,
                    borderLeft: g === "Nữ" ? "none" : `1px solid ${palette.border}`,
                  }}
                >
                  {g}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label style={fieldLabel}>Số điện thoại</label>
            <input
              style={{ ...fieldInput, borderColor: errors.personal ? palette.danger : palette.border }}
              value={phone}
              onChange={(e) => { setPhone(e.target.value); clearError("personal"); }}
              placeholder="Nhập SĐT"
            />
          </div>
        </div>
      </div>
      {errors.personal && <p style={errorStyle}>{errors.personal}</p>}
      <div style={{ marginBottom: 24 }} />

      {/* Section: Đặt lịch khám */}
      {sectionHeader("Đặt lịch khám")}
      <div style={{ border: `1px solid ${palette.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 20, marginBottom: 4 }}>
        <div className="grid-3col" style={{ marginBottom: 16 }}>
          <div>
            <label style={fieldLabel}>Tỉnh / Thành phố <span style={{ color: palette.danger }}>*</span></label>
            <select style={{ ...fieldSelect, borderColor: errors.booking && !city ? palette.danger : palette.border }} value={city} onChange={(e) => { setCity(e.target.value); setHospital(""); clearError("booking"); }}>
              <option value="">Chọn Tỉnh/Thành phố</option>
              {CONFIG.cities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Bệnh viện / Phòng khám <span style={{ color: palette.danger }}>*</span></label>
            <select style={{ ...fieldSelect, borderColor: errors.booking && !hospital ? palette.danger : palette.border }} value={hospital} onChange={(e) => { setHospital(e.target.value); clearError("booking"); }} disabled={!city}>
              <option value="">Chọn Bệnh viện / Phòng khám</option>
              {hospitals.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label style={fieldLabel}>Ngày khám <span style={{ color: palette.danger }}>*</span></label>
            <select style={{ ...fieldSelect, borderColor: errors.booking && !date ? palette.danger : palette.border }} value={date} onChange={(e) => { setDate(e.target.value); clearError("booking"); }}>
              <option value="">DD / MM / YYYY</option>
              {dates.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="grid-1-2">
          <div>
            <label style={fieldLabel}>Giờ khám <span style={{ color: palette.danger }}>*</span></label>
            <select style={{ ...fieldSelect, borderColor: errors.booking && !time ? palette.danger : palette.border }} value={time} onChange={(e) => { setTime(e.target.value); clearError("booking"); }}>
              <option value="">Chọn khung giờ khám</option>
              {CONFIG.timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>
      {errors.booking && <p style={errorStyle}>{errors.booking}</p>}
      <div style={{ marginBottom: 24 }} />

      {/* Section: Danh mục Chương trình khám sức khoẻ */}
      {sectionHeader("Danh mục Chương trình khám sức khoẻ")}
      <div style={{ border: `1px solid ${palette.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 20, marginBottom: 24 }}>
        <div style={{ ...fieldSelect, marginBottom: 16, fontWeight: 500, color: palette.text }}>
          {CONFIG.packages.employee.label}
        </div>
        <div className="grid-4col">
          {CONFIG.packages.employee.items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "12px 14px",
                fontSize: 13,
                fontFamily: font,
                color: palette.text,
                border: `1px solid ${palette.border}`,
                marginTop: -1,
                marginLeft: -1,
                background: "#FFF",
                display: "flex",
                alignItems: "center",
                textAlign: "left",
                minHeight: 48,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Consent + Submit */}
      <div style={{ textAlign: "center", paddingBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label className="consent-label" style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => { setAgreed(e.target.checked); clearError("consent"); }}
              style={{ accentColor: palette.primary, width: 18, height: 18, flexShrink: 0, marginTop: 2 }}
            />
            <span className="consent-text" style={{ fontSize: 14, color: palette.text, fontFamily: font }}>
              Tôi đã đọc và đồng ý với các{" "}
              <span
                style={{ color: palette.primary, fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTerms(true); }}
              >Điều khoản dịch vụ</span>{" "}
              của WhiteCoat
            </span>
          </label>
        </div>
        {showTerms && <TermsModal title="Điều khoản Dịch vụ" onClose={() => setShowTerms(false)} />}
        {errors.consent && <p style={{ ...errorStyle, textAlign: "center" }}>{errors.consent}</p>}

        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <button
            style={{
              ...baseBtn,
              width: 280,
              maxWidth: "100%",
              padding: "14px 0",
              fontSize: 16,
              borderRadius: 30,
              background: isReady ? palette.primary : "#E8E8E8",
              color: isReady ? "#FFF" : "#B0B0B0",
              fontWeight: 600,
              cursor: isReady ? "pointer" : "default",
            }}
            onClick={handleSubmit}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

function Step5_Confirmation({ bookingData, onReset, onEdit }) {
  const emp = bookingData.employee;
  const [emailStatus, setEmailStatus] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    if (emailStatus !== null) return;
    setEmailStatus('sending');
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emp.email,
        bookingId: bookingData.bookingId,
        employee: emp,
        packageName: CONFIG.packages.employee.label,
      }),
    })
      .then((r) => r.json())
      .then((data) => setEmailStatus(data.success ? 'sent' : 'error'))
      .catch(() => setEmailStatus('error'));
  }, []);

  const handleDownloadPdf = () => {
    try {
      setPdfError(false);
      const pdfContent = `
        <html><head><meta charset="UTF-8"/>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1E293B; max-width: 700px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 32px; }
          .header h1 { color: #00adee; font-size: 22px; margin: 0 0 4px; }
          .header p { color: #64748B; font-size: 14px; margin: 0; }
          .check { width: 60px; height: 60px; border-radius: 50%; background: #00adee; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
          .check svg { width: 30px; height: 30px; }
          .card { border: 1px solid #E2E8F0; border-radius: 10px; padding: 24px; margin-bottom: 20px; }
          .section-bar { border-left: 3px solid #00adee; padding-left: 12px; margin-bottom: 16px; font-weight: 700; font-size: 14px; }
          .row { display: flex; gap: 24px; margin-bottom: 12px; flex-wrap: wrap; }
          .field { flex: 1; min-width: 150px; }
          .field-label { font-size: 11px; color: #64748B; margin-bottom: 2px; }
          .field-value { font-size: 14px; font-weight: 600; }
          .divider { border-top: 1px solid #E2E8F0; padding-top: 20px; margin-top: 8px; }
          .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #E2E8F0; color: #64748B; font-size: 12px; }
        </style></head><body>
        <div class="header">
          <div class="check"><svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#FFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <h1>Đặt lịch hẹn thành công!</h1>
          <p>Mã lịch hẹn <strong>${bookingData.bookingId}</strong></p>
        </div>
        <div class="card">
          <div class="section-bar">Thông tin cá nhân</div>
          <div class="row">
            <div class="field"><div class="field-label">Gói đăng ký:</div><div class="field-value">${CONFIG.packages.employee.label}</div></div>
            <div class="field"><div class="field-label">Họ Tên:</div><div class="field-value">${emp.name}</div></div>
            <div class="field"><div class="field-label">Mã nhân viên:</div><div class="field-value">${emp.employeeId}</div></div>
          </div>
          <div class="row">
            <div class="field"><div class="field-label">Email:</div><div class="field-value">${emp.email}</div></div>
            <div class="field"><div class="field-label">Ngày sinh:</div><div class="field-value">${emp.dob}</div></div>
            <div class="field"><div class="field-label">Giới tính:</div><div class="field-value">${emp.gender.toUpperCase()}</div></div>
          </div>
          <div class="divider">
            <div class="section-bar">Thông tin lịch khám</div>
            <div class="row">
              <div class="field"><div class="field-label">Tỉnh/Thành phố:</div><div class="field-value">${emp.city}</div></div>
              <div class="field"><div class="field-label">Bệnh viện/Phòng khám:</div><div class="field-value">${emp.hospital}</div></div>
            </div>
            <div class="row">
              <div class="field"><div class="field-label">Ngày hẹn:</div><div class="field-value">${emp.date}</div></div>
              <div class="field"><div class="field-label">Giờ khám:</div><div class="field-value">${emp.time}</div></div>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Liên hệ hỗ trợ: <strong>1900 5118</strong> | Email <strong>info@whitecoat.vn</strong></p>
          <p>CÔNG TY TNHH WHITECOAT VIỆT NAM</p>
        </div>
        </body></html>
      `;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        setPdfError(true);
        return;
      }
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 300);
      };
    } catch {
      setPdfError(true);
    }
  };

  const fieldPair = (label, value) => (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: palette.textMuted, fontFamily: font, display: "block", marginBottom: 2 }}>{label}</span>
      <span style={{ fontSize: 15, color: palette.text, fontWeight: 600, fontFamily: font }}>{value}</span>
    </div>
  );

  const sectionBar = (text) => (
    <div style={{ borderLeft: `3px solid ${palette.primary}`, paddingLeft: 12, marginBottom: 16 }}>
      <span style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: palette.text }}>{text}</span>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
      {/* Page header with logos */}
      <div className="page-header-logos" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 28px" }}>
        <Logo size={36} />
        <div className="badge-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: palette.textMuted, fontFamily: font }}>Đơn vị đồng hành</span>
          <Logo size={24} />
        </div>
      </div>

      {/* Success icon */}
      <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: palette.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: font, fontSize: 24, fontWeight: 800, color: palette.primary, margin: "0 0 6px" }}>
          Đặt lịch hẹn thành công!
        </h2>
        <p style={{ fontSize: 14, color: palette.textMuted, fontFamily: font, margin: 0 }}>
          Mã lịch hẹn <strong style={{ color: palette.text }}>{bookingData.bookingId}</strong>
        </p>
        {emailStatus === 'sending' && (
          <p style={{ fontSize: 13, color: palette.primary, fontFamily: font, marginTop: 8 }}>📧 Đang gửi xác nhận đến {emp.email}...</p>
        )}
        {emailStatus === 'sent' && (
          <p style={{ fontSize: 13, color: palette.success, fontFamily: font, marginTop: 8 }}>✓ Email xác nhận đã gửi đến {emp.email}</p>
        )}
        {emailStatus === 'error' && (
          <p style={{ fontSize: 13, color: palette.warning, fontFamily: font, marginTop: 8 }}>⚠ Không thể gửi email xác nhận (chế độ demo)</p>
        )}
      </div>

      {/* Info card */}
      <div style={{ border: `1px solid ${palette.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 28, background: "#FFF" }}>
        {/* Thông tin cá nhân */}
        {sectionBar("Thông tin cá nhân")}
        <div className="grid-3col" style={{ marginBottom: 16 }}>
          {fieldPair("Gói đăng ký:", CONFIG.packages.employee.label)}
          {fieldPair("Họ Tên:", emp.name)}
          {fieldPair("Mã nhân viên:", emp.employeeId)}
        </div>
        <div className="grid-3col" style={{ marginBottom: 24 }}>
          {fieldPair("Email:", emp.email)}
          {fieldPair("Ngày sinh:", emp.dob)}
          {fieldPair("Giới tính:", emp.gender.toUpperCase())}
        </div>

        <div style={{ borderTop: `1px solid ${palette.border}`, paddingTop: 20 }}>
          {sectionBar("Thông tin lịch khám")}
          <div className="grid-2col" style={{ marginBottom: 16 }}>
            {fieldPair("Tỉnh/Thành phố:", emp.city)}
            {fieldPair("Bệnh viện/Phòng khám:", emp.hospital)}
          </div>
          <div className="grid-2col">
            {fieldPair("Ngày hẹn:", emp.date)}
            {fieldPair("Giờ khám:", emp.time)}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <button
          style={{
            ...baseBtn,
            flex: "1 1 200px",
            maxWidth: 260,
            padding: "14px 0",
            fontSize: 15,
            borderRadius: 30,
            background: "#FFF",
            color: palette.text,
            border: `1.5px solid ${palette.border}`,
          }}
          onClick={onReset}
        >
          Huỷ lịch
        </button>
        <button
          style={{
            ...baseBtn,
            flex: "1 1 200px",
            maxWidth: 260,
            padding: "14px 0",
            fontSize: 15,
            borderRadius: 30,
            background: palette.primary,
            color: "#FFF",
          }}
          onClick={onEdit}
        >
          Thay đổi thông tin
        </button>
      </div>

      <p
        onClick={handleDownloadPdf}
        style={{ textAlign: "center", fontSize: 14, color: palette.primary, marginBottom: 8, cursor: "pointer", fontFamily: font, textDecoration: "underline" }}
      >
        Tải thông tin lịch hẹn
      </p>
      {pdfError && (
        <p style={{ textAlign: "center", fontSize: 13, color: palette.warning, fontFamily: font, marginBottom: 40, fontWeight: 500 }}>
          ⚠ Giao diện demo chưa hỗ trợ tính năng này, mong anh/chị thử lại sau
        </p>
      )}
    </div>
  );
}

// ─── Main App ───
export default function WhiteCoatBookingDemo() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [currentOtp, setCurrentOtp] = useState("");

  const goStep = useCallback((s) => {
    setStep(s);
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }, []);

  const handleStep1Next = (email, otp) => {
    setUserEmail(email);
    setCurrentOtp(otp);
    goStep(2);
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: userEmail }),
      });
      const data = await res.json();
      if (data.success && data.otp) {
        setCurrentOtp(data.otp);
      }
    } catch {}
  };

  return (
    <div style={{ fontFamily: font, background: palette.bg, minHeight: "100vh" }}>
      <ResponsiveStyles />
      <DemoBanner />
      <Header />
      <StepIndicator current={step} onStepClick={goStep} />

      <div style={{ padding: "12px 16px 40px" }}>
        {step === 1 && <Step1_Landing onNext={handleStep1Next} />}

        {step === 2 && (
          <Step2_OTP
            onNext={() => goStep(3)}
            userEmail={userEmail}
            realOtp={currentOtp}
            onResendOtp={handleResendOtp}
          />
        )}

        {step === 3 && (
          <Step3_Employee
            onNext={() => goStep(4)}
            onBookingData={setBookingData}
            initialData={bookingData}
            userEmail={userEmail}
          />
        )}

        {step === 4 && bookingData && (
          <Step5_Confirmation
            bookingData={bookingData}
            onReset={() => { setBookingData(null); setUserEmail(""); setCurrentOtp(""); goStep(1); }}
            onEdit={() => goStep(3)}
          />
        )}
      </div>

      <footer style={{ textAlign: "center", padding: "20px 16px 32px", borderTop: `1px solid ${palette.border}` }}>
        <p style={{ fontSize: 13, color: palette.textMuted, fontFamily: font, margin: "0 0 4px" }}>
          Liên hệ hỗ trợ: <strong style={{ color: palette.text }}>{CONFIG.hotline}</strong> | Email{" "}
          <strong style={{ color: palette.text }}>{CONFIG.email}</strong>
        </p>
        <p style={{ fontSize: 12, color: palette.textMuted, fontFamily: font, margin: 0 }}>
          CÔNG TY TNHH WHITECOAT VIỆT NAM
        </p>
      </footer>
    </div>
  );
}
