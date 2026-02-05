import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';

import { InputformService } from '../../services/inputform.service';

@Component({
  selector: 'app-inputform',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './inputform.component.html',
  styleUrls: ['./inputform.component.css']
})
export class InputformComponent implements OnInit {

  // ⭐ modern inject (ดีกว่า constructor)
  private fb = inject(FormBuilder);
  private api = inject(InputformService);

  occupations: string[] = [];

  submitting = false;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  successId: string | null = null;
  errorMessage: string | null = null;

  // ⭐ fb ใช้ได้แน่นอน
  form: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    occupation: ['', Validators.required],
    sex: ['male', Validators.required],
    birth_day: ['', Validators.required]
  });

  // ===============================
  // INIT
  // ===============================

  ngOnInit(): void {

    this.api.getOccupations().subscribe({
      next: (x) => this.occupations = x ?? [],
      error: () => {
        // fallback
        this.occupations = [
          'Engineer',
          'Teacher',
          'Designer',
          'Accountant',
          'Other'
        ];
      }
    });
  }

  // ===============================
  // FILE PREVIEW
  // ===============================

  onFileChange(ev: Event) {

    this.successId = null;
    this.errorMessage = null;

    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = null;
    this.previewUrl = null;

    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowed.includes(file.type)) {
      input.value = '';
      this.errorMessage = 'รองรับเฉพาะ PNG / JPEG / WEBP';
      return;
    }

    // ⭐ ปรับให้ตรง backend
    if (file.size > 1_000_000) {
      input.value = '';
      this.errorMessage = 'ไฟล์ต้องไม่เกิน 1MB';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  // ===============================
  // SUBMIT
  // ===============================

  submit() {

    this.successId = null;
    this.errorMessage = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'กรุณากรอกข้อมูลให้ครบ';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'กรุณาแนบรูป Profile';
      return;
    }

    const v = this.form.value;

    const fd = new FormData();

    fd.append('first_name', v.first_name ?? '');
    fd.append('last_name', v.last_name ?? '');
    fd.append('email', v.email ?? '');
    fd.append('phone', v.phone ?? '');
    fd.append('occupation', v.occupation ?? '');
    fd.append('sex', v.sex ?? '');
    fd.append('birth_day', v.birth_day ?? '');

    fd.append('profile', this.selectedFile, this.selectedFile.name);

    this.submitting = true;

    this.api.create(fd).subscribe({
      next: (res) => {

        this.submitting = false;

        this.successId = res?.id ?? 'saved';

        this.form.reset({
          sex: 'male'
        });

        this.previewUrl = null;
        this.selectedFile = null;
      },
      error: (err) => {

        this.submitting = false;

        this.errorMessage =
          err?.error?.message ??
          'บันทึกไม่สำเร็จ';
      }
    });
  }

  // ===============================
  // CLEAR
  // ===============================

  clear() {

    this.form.reset({
      sex: 'male'
    });

    this.previewUrl = null;
    this.selectedFile = null;
    this.successId = null;
    this.errorMessage = null;
  }
}
