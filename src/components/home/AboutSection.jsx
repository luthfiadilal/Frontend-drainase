import React from 'react';

const AboutSection = () => {
  return (
    <section id="tentang" className="py-16 lg:py-20 bg-slate-50 border-t border-slate-100">
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tentang SI-DRAINASE</h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Drainase merupakan sistem yang berfungsi untuk mengalirkan dan mengendalikan air agar tidak terjadi genangan di suatu wilayah.
            </p>
            <p>
              Kondisi drainase penting dalam mitigasi banjir karena drainase yang tersumbat, rusak, atau tidak berfungsi dengan baik dapat menghambat aliran air, menyebabkan genangan, dan meningkatkan risiko banjir. Oleh karena itu, pemantauan kondisi drainase diperlukan untuk mengetahui wilayah yang membutuhkan perhatian.
            </p>
            <p className="font-semibold text-gray-900 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
              SI-DRAINASE hadir sebagai website yang mengolah data kondisi drainase dari laporan masyarakat menjadi informasi prioritas pembersihan, sehingga wilayah yang membutuhkan penanganan dapat diidentifikasi dan ditangani secara lebih terarah dan tepat sasaran.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
