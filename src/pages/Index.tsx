import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface HistoryItem {
  id: string;
  number: number;
  min: number;
  max: number;
  timestamp: Date;
}

const Index = () => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [generatedNumber, setGeneratedNumber] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('numberHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })));
    }
  }, []);

  const saveToLocalStorage = (newHistory: HistoryItem[]) => {
    localStorage.setItem('numberHistory', JSON.stringify(newHistory));
  };

  const generateNumber = () => {
    if (min >= max) {
      toast.error('Минимум должен быть меньше максимума');
      return;
    }

    setIsAnimating(true);
    
    let counter = 0;
    const interval = setInterval(() => {
      const tempNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      setGeneratedNumber(tempNumber);
      counter++;
      
      if (counter >= 20) {
        clearInterval(interval);
        const finalNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        setGeneratedNumber(finalNumber);
        
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          number: finalNumber,
          min,
          max,
          timestamp: new Date()
        };
        
        const newHistory = [newItem, ...history].slice(0, 50);
        setHistory(newHistory);
        saveToLocalStorage(newHistory);
        setIsAnimating(false);
        
        toast.success(`Сгенерировано число: ${finalNumber}`);
      }
    }, 50);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('numberHistory');
    toast.success('История очищена');
  };

  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    saveToLocalStorage(newHistory);
    toast.success('Запись удалена');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Dices" size={48} className="text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NumGen
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Генератор случайных чисел с историей
          </p>
        </header>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Icon name="Home" size={18} />
              <span>Главная</span>
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Icon name="Sparkles" size={18} />
              <span>Генератор</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Icon name="History" size={18} />
              <span>История</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon name="Zap" size={24} className="text-primary" />
                  </div>
                  <CardTitle>Быстрая генерация</CardTitle>
                  <CardDescription>
                    Мгновенное создание случайных чисел в заданном диапазоне
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-secondary/20 hover:border-secondary/40 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Icon name="Database" size={24} className="text-secondary" />
                  </div>
                  <CardTitle>Локальное хранение</CardTitle>
                  <CardDescription>
                    История сохраняется в браузере без использования сервера
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-accent/20 hover:border-accent/40 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                    <Icon name="Clock" size={24} className="text-accent" />
                  </div>
                  <CardTitle>История генераций</CardTitle>
                  <CardDescription>
                    Все результаты сохраняются с временными метками
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-primary/20 hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon name="Settings" size={24} className="text-primary" />
                  </div>
                  <CardTitle>Настраиваемые диапазоны</CardTitle>
                  <CardDescription>
                    Установите любые минимальные и максимальные значения
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="mt-6 border-primary/30 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Icon name="Info" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Как использовать</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Перейдите на вкладку "Генератор"
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Установите минимальное и максимальное значение
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Нажмите кнопку "Генерировать"
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Просматривайте историю во вкладке "История"
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="animate-fade-in">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl">Генератор чисел</CardTitle>
                <CardDescription>
                  Настройте диапазон и генерируйте случайное число
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Icon name="ArrowDown" size={16} />
                      Минимум
                    </label>
                    <Input
                      type="number"
                      value={min}
                      onChange={(e) => setMin(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Icon name="ArrowUp" size={16} />
                      Максимум
                    </label>
                    <Input
                      type="number"
                      value={max}
                      onChange={(e) => setMax(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                </div>

                {generatedNumber !== null && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <p className="text-muted-foreground text-sm uppercase tracking-wider">
                      Результат
                    </p>
                    <div className={`text-8xl md:text-9xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent ${isAnimating ? 'animate-pulse-glow' : 'animate-scale-in'}`}>
                      {generatedNumber}
                    </div>
                  </div>
                )}

                <Button
                  onClick={generateNumber}
                  disabled={isAnimating}
                  size="lg"
                  className="w-full text-lg h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                >
                  {isAnimating ? (
                    <>
                      <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={20} className="mr-2" />
                      Генерировать число
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Icon name="TrendingUp" size={16} />
                  <span>Всего сгенерировано: {history.length}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">История генераций</CardTitle>
                    <CardDescription>
                      Последние {history.length} записей
                    </CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={clearHistory}
                      className="gap-2"
                    >
                      <Icon name="Trash2" size={16} />
                      Очистить
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="History" size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">История пуста</p>
                    <p className="text-sm mt-2">Сгенерируйте первое число</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                    {history.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-primary/10 hover:border-primary/30 transition-all group animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-primary">
                            {item.number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Icon name="ArrowDown" size={14} />
                              {item.min} - {item.max}
                              <Icon name="ArrowUp" size={14} />
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Icon name="Clock" size={14} />
                              {item.timestamp.toLocaleString('ru-RU')}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteHistoryItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="X" size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
