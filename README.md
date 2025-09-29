# Drag2ASCII

# ASCII Art Converter

A command-line tool to convert images into ASCII art with optional color support.

## Installation

You can install this package globally using npm:

```bash
npm install -g ascii-art-converter
```

## Usage

After installation, you can use the tool from anywhere in your terminal:

```bash
ascii-art <input-image> [options]
```

### Options

- `-c, --color`: Enable colored ASCII output
- `-w, --width <number>`: Set ASCII width in characters (150-500, default: 500)

### Examples

Convert an image to ASCII art with default settings:
```bash
ascii-art image.jpg
```

Convert with color and custom width:
```bash
ascii-art image.jpg -c -w 300
```

## Output

The tool generates an `ascii.png` file in your current directory containing the ASCII art representation of your input image.

## Requirements

- Node.js 14 or higher
- NPM 6 or higher

## License

MIT
- `-h, --help`: Display help information

### Examples

```bash
# Convert image to ASCII art (saves to ascii.png)
node asciiart.js photo.jpg

# Create colored ASCII art with custom width
node asciiart.js photo.jpg -c -w 300

# Create colored ASCII with default width (500)
node asciiart.js photo.jpg -c
```

## Dependencies

- **canvas**: For rendering ASCII art to PNG images
- **jimp**: For image processing and pixel manipulation
- **commander**: For command-line argument parsing

## Features

- Converts any image format supported by Jimp to ASCII art
- Supports both monochrome and colored ASCII output
- Customizable width (150-500 characters) with proper aspect ratio
- Always exports to 'ascii.png'
- Comprehensive error handling with input validation
- Proper ES module support
