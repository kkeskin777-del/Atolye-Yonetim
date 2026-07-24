import { AppDataStore } from '../types';

export const GAS_SCRIPT_TEMPLATE = `/**
 * Google Apps Script (GAS) Web App Backend for Marangoz Atölyesi Yönetim Uygulaması
 * 
 * Kurulum Adımları:
 * 1. Google Drive'da yeni bir Google E-Tablo (Google Sheets) oluşturun.
 * 2. Üst menüden "Uzantılar" -> "Apps Script" seçeneğine tıklayın.
 * 3. Açılan kod editöründeki tüm kodları silip BU KODUN TAMAMINI yapıştırın.
 * 4. Sağ üstteki "Yayınla" / "Dağıt" (Deploy) -> "Yeni Dağıtım" (New Deployment) seçin.
 * 5. Tür olarak "Web Uygulaması" (Web App) seçin.
 * 6. "Erişimi Olanlar" (Who has access) seçeneğini "Herkes" (Anyone) olarak ayarlayın.
 * 7. "Dağıt" butonuna basıp çıkan Web App URL bağlantısını kopyalayın.
 * 8. Kopyaladığınız URL'yi Marangoz Atölyesi uygulamasındaki "Ayarlar -> Google Apps Script Sync" alanına yapıştırın.
 */

function doGet(e) {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName("DataStore");
  
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "empty", message: "Henüz kaydedilmiş veri yok." }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var cellValue = sheet.getRange("A1").getValue();
  if (!cellValue) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "empty", message: "Boş veri deposu." }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService
    .createTextOutput(cellValue)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName("DataStore");
    
    if (!sheet) {
      sheet = doc.insertSheet("DataStore");
    }
    
    var jsonString = e.postData.contents;
    // Test if valid JSON
    JSON.parse(jsonString);
    
    sheet.getRange("A1").setValue(jsonString);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;

export async function pushToGoogleScript(url: string, store: AppDataStore): Promise<{ success: boolean; message: string }> {
  if (!url || !url.trim().startsWith('http')) {
    return { success: false, message: 'Geçersiz veya boş Google Apps Script URL adresi.' };
  }

  try {
    const payload = JSON.stringify(store);
    // Google Apps Script requires text/plain or no-cors / standard POST
    const response = await fetch(url.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });

    if (response.ok) {
      const result = await response.json().catch(() => ({ status: 'success' }));
      return { success: true, message: result.timestamp ? `Senkronize edildi (${new Date(result.timestamp).toLocaleTimeString()})` : 'Google Sheets e-tablonuza başarıyla gönderildi!' };
    } else {
      return { success: false, message: `Sunucu yanıt hatası: HTTP ${response.status}` };
    }
  } catch (err) {
    console.error('GAS Sync push error:', err);
    return { success: false, message: 'Senkronizasyon hatası: İnternet bağlantınızı veya Script URL adresinizi kontrol edin.' };
  }
}

export async function pullFromGoogleScript(url: string): Promise<{ success: boolean; data?: AppDataStore; message: string }> {
  if (!url || !url.trim().startsWith('http')) {
    return { success: false, message: 'Geçersiz veya boş Google Apps Script URL adresi.' };
  }

  try {
    const response = await fetch(url.trim());
    if (response.ok) {
      const data = await response.json();
      if (data && data.rawMaterials && data.orders) {
        return { success: true, data: data as AppDataStore, message: 'Google Sheets üzerinden verileriniz başarıyla çekildi!' };
      } else if (data && data.status === 'empty') {
        return { success: false, message: 'E-tablonuzda henüz kaydedilmiş veri bulunmuyor.' };
      } else {
        return { success: false, message: 'Alınan veri formatı uyumsuz veya geçersiz.' };
      }
    } else {
      return { success: false, message: `HTTP Yanıt hatası: ${response.status}` };
    }
  } catch (err) {
    console.error('GAS Sync pull error:', err);
    return { success: false, message: 'Veri çekilemedi: URL adresini veya erişim izinlerini kontrol edin.' };
  }
}
