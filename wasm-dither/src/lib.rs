use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct DitherConfig {
    threshold: f32,
    pattern_size: u32,
}

#[wasm_bindgen]
pub struct DitherProcessor {
    config: DitherConfig,
}

#[wasm_bindgen]
impl DitherProcessor {
    #[wasm_bindgen(constructor)]
    pub fn new(config_js: JsValue) -> Result<DitherProcessor, JsValue> {
        let config: DitherConfig = serde_wasm_bindgen::from_value(config_js)?;
        Ok(DitherProcessor { config })
    }

    pub fn process_image_data(&self, data: &[u8], width: u32, height: u32) -> Vec<u8> {
        let mut output = data.to_vec();
        
        for y in 0..height {
            for x in 0..width {
                let idx = ((y * width + x) * 4) as usize;
                let r = data[idx] as f32 / 255.0;
                let g = data[idx + 1] as f32 / 255.0;
                let b = data[idx + 2] as f32 / 255.0;
                
                let gray = 0.299 * r + 0.587 * g + 0.114 * b;
                let pattern_value = self.get_pattern_value(x, y);
                
                let dithered = if gray > pattern_value {
                    255
                } else {
                    0
                };
                
                output[idx] = dithered;
                output[idx + 1] = dithered;
                output[idx + 2] = dithered;
            }
        }
        
        output
    }

    fn get_pattern_value(&self, x: u32, y: u32) -> f32 {
        let pattern_x = x % self.config.pattern_size;
        let pattern_y = y % self.config.pattern_size;
        let pattern_idx = pattern_y * self.config.pattern_size + pattern_x;
        
        (pattern_idx as f32) / (self.config.pattern_size * self.config.pattern_size) as f32
    }
}