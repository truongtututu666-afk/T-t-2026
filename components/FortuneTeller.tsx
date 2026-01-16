import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

const FortuneTeller: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [birthData, setBirthData] = useState({ date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [monthlyPredictions, setMonthlyPredictions] = useState<string[]>([]);

  // Fallback data
  const STATIC_MONTHS = [
      "Tháng 1: Khởi đầu thuận lợi, có quý nhân phù trợ.",
      "Tháng 2: Cẩn thận sức khỏe, tránh đi xa.",
      "Tháng 3: Tài lộc vào nhà, công việc thăng tiến.",
      "Tháng 4: Gặp chút khó khăn trong tình cảm.",
      "Tháng 5: Cơ hội đầu tư sinh lời lớn.",
      "Tháng 6: Gia đạo bình an, hạnh phúc.",
      "Tháng 7: Đề phòng tiểu nhân hãm hại.",
      "Tháng 8: Sức khỏe dồi dào, tinh thần phấn chấn.",
      "Tháng 9: Có tin vui từ phương xa.",
      "Tháng 10: Tài chính ổn định, dư dả.",
      "Tháng 11: Công việc bận rộn nhưng gặt hái nhiều.",
      "Tháng 12: Tổng kết năm thắng lợi, an khang."
  ];

  const handlePredict = async () => {
    if (!birthData.date) return;
    setLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `
                Hãy đóng vai một thầy tử vi uyên bác, thâm thúy.
                Dựa trên ngày sinh: ${birthData.date} và giờ sinh: ${birthData.time || 'Không rõ'}.
                Hãy luận giải vận hạn chi tiết cho gia chủ trong năm Bính Ngọ 2026 (Năm con Ngựa Lửa).
                Viết ngắn gọn, súc tích, mang tính dự báo cho 12 tháng âm lịch.
            `,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Danh sách 12 lời tiên tri cho 12 tháng âm lịch."
                }
            }
        });

        const jsonText = response.text;
        if (jsonText) {
            const parsedData = JSON.parse(jsonText);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
                const filledData = [...parsedData];
                while(filledData.length < 12) filledData.push("Vạn sự tùy duyên, tâm an vạn sự an.");
                setMonthlyPredictions(filledData.slice(0, 12));
            } else {
                throw new Error("Invalid format");
            }
        } else {
            throw new Error("No response text");
        }

        setStep(2);
    } catch (error) {
        console.error("Gemini Error:", error);
        setMonthlyPredictions(STATIC_MONTHS);
        setStep(2);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-tet-dark">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 p-6 pb-0">
        <button onClick={() => navigate(-1)} className="p-2 glass-panel rounded-full text-white/70 hover:text-white">
            <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-tet-gold">Tử Vi 2026</h1>
      </div>

      <div className="flex-1 p-6 relative overflow-hidden">
        {step === 1 ? (
            <div className="glass-panel rounded-[2.5rem] p-8 h-full flex flex-col animate-fade-in-up">
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-tr from-tet-gold to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(255,214,10,0.3)]">
                        <Star size={48} className="text-white" />
                    </div>
                </div>
                
                <h3 className="text-center text-xl font-bold text-white mb-2">Nhập Thông Tin</h3>
                <p className="text-center text-white/50 text-sm mb-10">Để xem vận hạn chi tiết từng tháng năm Bính Ngọ.</p>

                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3 focus-within:border-tet-gold transition-colors">
                        <Calendar className="text-gray-400" />
                        <div className="flex-1">
                            <label className="text-[10px] uppercase text-gray-500 block mb-1">Ngày sinh (Dương lịch)</label>
                            <input 
                              type="date" 
                              className="bg-transparent w-full text-white outline-none text-lg"
                              onChange={(e) => setBirthData({...birthData, date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3 focus-within:border-tet-gold transition-colors">
                        <Clock className="text-gray-400" />
                        <div className="flex-1">
                            <label className="text-[10px] uppercase text-gray-500 block mb-1">Giờ sinh</label>
                            <input 
                              type="text" 
                              placeholder="VD: 07:15 sáng"
                              className="bg-transparent w-full text-white outline-none text-lg placeholder-white/20"
                              onChange={(e) => setBirthData({...birthData, time: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <button 
                  onClick={handlePredict}
                  disabled={!birthData.date || loading}
                  className="w-full mt-auto bg-gradient-to-r from-tet-gold to-orange-400 text-black font-bold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                    {loading ? 'Đang Luận Giải...' : 'Xem Tử Vi Ngay'} 
                    {loading && <Sparkles className="animate-spin" size={16}/>}
                </button>
            </div>
        ) : (
            <div className="glass-panel rounded-[2.5rem] p-0 h-full overflow-hidden flex flex-col animate-fade-in-up">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <h3 className="text-lg font-bold text-white">Lá Số 2026</h3>
                    <button onClick={() => setStep(1)} className="text-sm text-tet-gold">Xem lại</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {monthlyPredictions.map((text, idx) => (
                        <div key={idx} className="relative pl-8 border-l-2 border-white/10 last:border-0 pb-2">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-tet-dark border-2 border-tet-gold"></div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <h4 className="text-tet-peach font-serif font-bold text-lg mb-1">Tháng {idx + 1}</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                            </div>
                        </div>
                    ))}
                    <div className="h-20"></div> {/* Bottom Spacer */}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FortuneTeller;