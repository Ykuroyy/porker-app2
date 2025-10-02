// Web Audio APIを使用した簡単な効果音生成
class SoundEffect {
  private audioContext: AudioContext | null = null;

  constructor() {
    // ユーザーの操作後に音声コンテキストを初期化
    if (typeof window !== 'undefined') {
      document.addEventListener('click', () => {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
      }, { once: true });
    }
  }

  private createTone(frequency: number, duration: number, volume: number = 0.1): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  cardShuffle(): void {
    // カードシャッフル音（ノイズ風）
    if (!this.audioContext) return;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createTone(Math.random() * 200 + 100, 0.05, 0.03);
      }, i * 20);
    }
  }

  cardDeal(): void {
    // カード配布音
    this.createTone(440, 0.1, 0.05);
  }

  chipsBet(): void {
    // チップベット音
    this.createTone(600, 0.15, 0.06);
    setTimeout(() => {
      this.createTone(550, 0.1, 0.04);
    }, 50);
  }

  buttonClick(): void {
    // ボタンクリック音
    this.createTone(800, 0.08, 0.03);
  }

  gameWin(): void {
    // 勝利音
    const notes = [523, 659, 784, 1047]; // C, E, G, C
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.createTone(note, 0.3, 0.08);
      }, index * 150);
    });
  }

  gameLose(): void {
    // 敗北音
    const notes = [392, 349, 294]; // G, F, D (下降音)
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.createTone(note, 0.4, 0.06);
      }, index * 200);
    });
  }

  fold(): void {
    // フォールド音
    this.createTone(220, 0.2, 0.04);
  }

  raise(): void {
    // レイズ音
    this.createTone(880, 0.1, 0.06);
    setTimeout(() => {
      this.createTone(1100, 0.15, 0.05);
    }, 100);
  }

  call(): void {
    // コール音
    this.createTone(660, 0.12, 0.05);
  }

  check(): void {
    // チェック音
    this.createTone(440, 0.08, 0.04);
  }
}

export const soundEffects = new SoundEffect();