// Fungsi Toggle Lihat / Sembunyi Password
function togglePassword(inputId, button) {
  const inputField = document.getElementById(inputId);
  if (inputField.type === "password") {
    inputField.type = "text";
    button.textContent = "Sembunyi";
  } else {
    inputField.type = "password";
    button.textContent = "Lihat";
  }
}

// Handler Form Submit & Validasi Input
document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  let isValid = true;

  // Ambil elemen input
  const nama = document.getElementById('nama');
  const nik = document.getElementById('nik');
  const nisn = document.getElementById('nisn');
  const email = document.getElementById('email');
  const telepon = document.getElementById('telepon');
  const jenisKelamin = document.getElementById('jenisKelamin');
  const prodi = document.getElementById('prodi');
  const asalSekolah = document.getElementById('asalSekolah');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  // Reset semua status error
  resetErrors();

  // 1. Nama Lengkap
  if (nama.value.trim() === '') {
    showError(nama, 'namaError');
    isValid = false;
  }

  // 2. NIK (16 digit angka)
  const nikPattern = /^[0-9]{16}$/;
  if (!nikPattern.test(nik.value.trim())) {
    showError(nik, 'nikError');
    isValid = false;
  }

  // 3. NISN (10 digit angka)
  const nisnPattern = /^[0-9]{10}$/;
  if (!nisnPattern.test(nisn.value.trim())) {
    showError(nisn, 'nisnError');
    isValid = false;
  }

  // 4. Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    showError(email, 'emailError');
    isValid = false;
  }

  // 5. Nomor HP (08xx, 10-13 digit)
  const phonePattern = /^08[0-9]{8,11}$/;
  if (!phonePattern.test(telepon.value.trim())) {
    showError(telepon, 'teleponError');
    isValid = false;
  }

  // 6. Jenis Kelamin
  if (jenisKelamin.value === '') {
    showError(jenisKelamin, 'jenisKelaminError');
    isValid = false;
  }

  // 7. Program Studi
  if (prodi.value === '') {
    showError(prodi, 'prodiError');
    isValid = false;
  }

  // 8. Asal Sekolah
  if (asalSekolah.value.trim() === '') {
    showError(asalSekolah, 'asalSekolahError');
    isValid = false;
  }

  // 9. Syarat Password (Min. 8 karakter, kombinasi huruf & angka)
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(password.value)) {
    showError(password, 'passwordError');
    isValid = false;
  }

  // 10. Konfirmasi Password
  if (confirmPassword.value === '' || password.value !== confirmPassword.value) {
    showError(confirmPassword, 'confirmPasswordError');
    isValid = false;
  }

  // Jika SEMUA validasi lolos
  if (isValid) {
    const successAlert = document.getElementById('successAlert');
    successAlert.style.display = 'block';
    
    // Scroll ke atas agar notifikasi terlihat jelas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset formulir
    document.getElementById('registrationForm').reset();

    setTimeout(() => {
      successAlert.style.display = 'none';
    }, 5000);
  } else {
    document.getElementById('successAlert').style.display = 'none';
  }
});

function showError(inputElement, errorElementId) {
  inputElement.classList.add('input-error');
  document.getElementById(errorElementId).style.display = 'block';
}

function resetErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  const errorInputs = document.querySelectorAll('.input-error');

  errorMessages.forEach(msg => msg.style.display = 'none');
  errorInputs.forEach(input => input.classList.remove('input-error'));
}