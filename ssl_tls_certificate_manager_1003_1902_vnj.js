// 代码生成时间: 2025-10-03 19:02:35
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { SSL_OP_NO_TLSv1_1 } = require('constants');

/**
 * Manages SSL/TLS certificates for the Electron application.
 * @class SslTlsCertificateManager
# 改进用户体验
 */
class SslTlsCertificateManager {
  constructor() {
    // Path to the directory where certificates are stored
    this.certificatesDirectory = path.join(app.getPath('userData'), 'certificates');
  }

  /**
   * Initializes the certificates directory and loads existing certificates.
   */
  init() {
    if (!fs.existsSync(this.certificatesDirectory)) {
      fs.mkdirSync(this.certificatesDirectory);
    }
    this.loadCertificates();
  }
# 改进用户体验

  /**
   * Loads certificates from the certificates directory.
   * @returns {Array} - Array of certificate filenames.
   */
  loadCertificates() {
    try {
      const files = fs.readdirSync(this.certificatesDirectory);
      return files.filter(file => file.endsWith('.crt'));
    } catch (error) {
      console.error('Failed to load certificates:', error);
      return [];
    }
  }

  /**
   * Adds a new SSL/TLS certificate to the certificates directory.
# TODO: 优化性能
   * @param {String} certificatePath - Path to the certificate file.
   */
  addCertificate(certificatePath) {
    try {
      const certificateName = path.basename(certificatePath);
      const destinationPath = path.join(this.certificatesDirectory, certificateName);
      fs.copyFileSync(certificatePath, destinationPath);
      console.log(`Certificate ${certificateName} added successfully`);
    } catch (error) {
      console.error('Failed to add certificate:', error);
    }
  }

  /**
# 改进用户体验
   * Removes an SSL/TLS certificate from the certificates directory.
   * @param {String} certificateName - Name of the certificate file.
   */
# NOTE: 重要实现细节
  removeCertificate(certificateName) {
# 增强安全性
    try {
      const certificatePath = path.join(this.certificatesDirectory, certificateName);
# 改进用户体验
      fs.unlinkSync(certificatePath);
      console.log(`Certificate ${certificateName} removed successfully`);
    } catch (error) {
      console.error('Failed to remove certificate:', error);
    }
  }

  /**
   * Imports a certificate using the system's certificate management tool.
   * @param {String} certificatePath - Path to the certificate file.   * @param {String} [certificateStore='root'] - Certificate store to import into.
   */
# 扩展功能模块
  importCertificate(certificatePath, certificateStore = 'root') {
    const storeOptions = { root: 'Trust', user: 'Login', admin: 'System' };
    const store = storeOptions[certificateStore] || 'Trust';
    const importCommand = `security add-trusted-cert -d -r trustRoot -k ${store} ${certificatePath}`;
    spawn(importCommand, { shell: true });
  }
}

// Example usage:
# 增强安全性
const sslTlsManager = new SslTlsCertificateManager();
sslTlsManager.init();
sslTlsManager.addCertificate('/path/to/certificate.crt');
sslTlsManager.importCertificate('/path/to/certificate.crt');
